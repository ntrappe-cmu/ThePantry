"""
Reservation Service

Coordinates the donation discovery and reservation workflow.
Main orchestrator that calls into Inventory Adapter, Hold Manager,
and History Manager.
"""
from services.history_service import HistoryService
from services.inventory_service import InventoryService
from services.hold_service import HoldService


class ReservationService:
    """
    Orchestrates the end-to-end donation reservation workflow.

    Acts as the primary entry point for reservation-related operations,
    delegating to HoldService for reservation state, InventoryService for
    donation lookups, and HistoryService for audit records.

    Attributes:
        inventory (InventoryService): Adapter used to query available donations.
    """
    
    def __init__(self, inventory_service: InventoryService) -> None:
        """
        Args:
            inventory_service: Concrete InventoryService implementation to use
                for donation lookups. Injected to support swapping mock vs.
                production inventory adapters.
        """
        self.inventory = inventory_service
        
    def get_available_donations(
        self, 
        lat: float = 0, 
        lng: float = 0, 
        radius: float = 50
    ) -> list[dict]:
        """
        Return donations that are not currently held.

        Fetches all donations from inventory within the given area, then
        filters out any with an active hold so only claimable items are returned.

        Args:
            lat: Latitude of the search center. Defaults to 0.
            lng: Longitude of the search center. Defaults to 0.
            radius: Search radius in miles. Defaults to 50.
        
        Returns:
            out: Donation dicts with ``isHeld: False``, ready to be reserved.
        """
        all_donations = self.inventory.get_available_donations(lat, lng, radius)
        held_ids = HoldService.get_held_donation_ids()
        
        available = []
        for d in all_donations:
            d["isHeld"] = d["id"] in held_ids
            if not d["isHeld"]:
                available.append(d)
        return available
    
    def get_all_donations(
        self,
        lat: float = 0,
        lng: float = 0,
        radius: float = 50
    ) -> list[dict]:
        """
        Return all donations with their current hold status annotated.

        Unlike ``get_available_donations``, held items are included - each
        donation dict will contain an ``isHeld`` boolean so the caller can
        display availability state without making a separate lookup.

        Args:
            lat: Latitude of the search center. Defaults to 0.
            lng: Longitude of the search center. Defaults to 0.
            radius: Search radius in miles. Defaults to 50.
        
        Returns:
            out: All donation dicts in range, each annotated with ``isHeld``.
        """
        all_donations = self.inventory.get_available_donations(lat, lng, radius)
        held_ids = HoldService.get_held_donation_ids()
        for d in all_donations:
            d["isHeld"] = d["id"] in held_ids
        return all_donations
        

    def request_hold(self, user_id: int, donation_id: str) -> dict:
        """
        Attempt to place a hold on a donation for a user.

        Validates the donation exists, then delegates to HoldService to
        atomically create the hold. Fails if the donation is already reserved.

        Args:
            user_id: ID of the user claiming the donation.
            donation_id: ID of the donation to reserve.
        
        Returns:
            out: On success: ``{"success": True, "hold": {...}, "donation": {...}}`` 
                 On failure: ``{"success": False, "error": "<reason>"}``
        """
        # Verify donation exists in inventory
        donation = self.inventory.get_donation_by_id(donation_id)
        if not donation:
            return {"success": False, "error": "Donation not found"}
        
        # Attempt to create the hold
        hold = HoldService.create_hold(user_id, donation_id)
        if not hold:
            return {"success": False, "error": "Donation is already reserved"}
        
        return {"success": True, "hold": hold.to_dict(), "donation": donation}
    
    def confirm_pickup(self, hold_id: int) -> dict:
        """
        Mark a hold as completed and write a permanent pickup record.

        Verifies the hold exists and is still active before completing it.
        Passes donation details from inventory to HistoryService to create
        an audit trail entry. Donation details are stored defensively — if the
        donation no longer exists in inventory, the history record is still
        created with nulls.

        Args:
            hold_id: ID of the hold being fulfilled.
            
        Returns:
            out: On success: ``{"success": True, "record": {...}}``
                 On failure: ``{"success": False, "error": "<reason>"}``
        """
        hold = HoldService.get_hold_by_id(hold_id)
        if not hold or not hold.is_active:
            return {"success": False, "error": "No active hold found"}
        
        # Complete the hold (returns None if it raced and expired between check and here)
        completed = HoldService.complete_hold(hold_id)
        if not completed:
            return {"success": False, "error": "Hold expired before pickup could be confirmed"}
        
        # Look up donation details to store in history
        donation = self.inventory.get_donation_by_id(hold.donation_id)
        
        # Record in history
        record = HistoryService.record_pickup(
            user_id=hold.user_id,
            donation_id=hold.donation_id,
            donation_description=donation.get("description") if donation else None,
            donor_contact=donation.get("donorContact") if donation else None,
            pickup_location=donation.get("address") if donation else None
        )
        return {"success": True, "record": record.to_dict()}
    
    def cancel_hold(self, hold_id: int) -> dict:
        """
        Cancel an active hold, returning the donation to the available pool.

        Args:
            hold_id: ID of the hold to cancel.
            
        Returns:
            out: On success: ``{"success": True, "hold": {...}}``
                 On failure: ``{"success": False, "error": "<reason>"}``
        """
        hold = HoldService.cancel_hold(hold_id)
        if not hold:
            return {"success": False, "error": "No active hold found to cancel"}
        return {"success": True, "hold": hold.to_dict()}