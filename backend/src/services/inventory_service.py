"""
Inventory Adapter

Wraps the external Donation Inventory Service API and translates external
data into our internal Donation format.
"""
from abc import ABC, abstractmethod

class InventoryService(ABC):
    """Abstract interface for the Donation Inventory Service."""
    
    @abstractmethod
    def get_available_donations(self, lat: float, lng: float, radius: float) -> list[dict]:
        """
        Fetch available donations within a geographic area.

        Args:
            lat: Latitude of the search center.
            lng: Longitude of the search center.
            radius: Search radius in miles.

        Returns:
            List of donation dicts with keys: id, description, donationType,
            quantity, donorName, donorContact, lat, lng, address, expiresAt.
        """
        pass
    
    @abstractmethod
    def get_donation_by_id(self, donation_id: str) -> dict | None:
        """
        Get a single donation by its ID.

        Returns:
            Donation dict or None if not found.
        """
        pass
    
class MockInventoryService(InventoryService):
    """
    Hardcoded stub for the Donation Inventory Service.

    Returns sample donation data for development and testing.
    """

    # Sample donations - pretend these come from the external service
    _DONATIONS = [
        {
            "id": "DON-001",
            "description": "Assorted fresh vegetables (carrots, broccoli, peppers)",
            "donationType": "Produce",
            "quantity": "~20 lbs",
            "donorName": "Pittsburgh Fresh Market",
            "donorContact": "412-555-0101",
            "lat": 40.4406,
            "lng": -79.9959,
            "address": "100 Market Square, Pittsburgh, PA 15222",
            "expiresAt": "2026-02-15T18:00:00Z",
        },
        {
            "id": "DON-002",
            "description": "Leftover catered sandwiches and wraps",
            "donationType": "Prepared Food",
            "quantity": "30 servings",
            "donorName": "CMU Cohon Center",
            "donorContact": "412-555-0202",
            "lat": 40.4433,
            "lng": -79.9423,
            "address": "5032 Forbes Ave, Pittsburgh, PA 15213",
            "expiresAt": "2026-02-12T20:00:00Z",
        },
        {
            "id": "DON-003",
            "description": "Canned soups and pasta (assorted, near sell-by date)",
            "donationType": "Canned Goods",
            "quantity": "2 cases",
            "donorName": "Giant Eagle - Squirrel Hill",
            "donorContact": "412-555-0303",
            "lat": 40.4381,
            "lng": -79.9226,
            "address": "5550 Forward Ave, Pittsburgh, PA 15217",
            "expiresAt": "2026-03-01T23:59:00Z",
        },
        {
            "id": "DON-004",
            "description": "Bakery items: bread loaves, rolls, and muffins",
            "donationType": "Bakery",
            "quantity": "~15 items",
            "donorName": "Allegro Hearth Bakery",
            "donorContact": "412-555-0404",
            "lat": 40.4385,
            "lng": -79.9245,
            "address": "5719 Bartlett St, Pittsburgh, PA 15217",
            "expiresAt": "2026-02-12T17:00:00Z",
        },
        {
            "id": "DON-005",
            "description": "Dairy products: milk, yogurt, cheese (refrigerated)",
            "donationType": "Dairy",
            "quantity": "~10 lbs",
            "donorName": "Trader Joe's - East Liberty",
            "donorContact": "412-555-0505",
            "lat": 40.4615,
            "lng": -79.9246,
            "address": "6343 Penn Ave, Pittsburgh, PA 15206",
            "expiresAt": "2026-02-14T12:00:00Z",
        },
    ]

    def get_available_donations(self, lat: float = 0, lng: float = 0, radius: float = 50) -> list[dict]:
        """Return all mock donations (no real geo-filtering in stub)."""
        # In the real implementation, this would call the external API
        # and filter by geographic area. The mock returns everything.
        return [d.copy() for d in self._DONATIONS]

    def get_donation_by_id(self, donation_id: str) -> dict | None:
        """Look up a single mock donation by ID."""
        for d in self._DONATIONS:
            if d["id"] == donation_id:
                return d.copy()
        return None