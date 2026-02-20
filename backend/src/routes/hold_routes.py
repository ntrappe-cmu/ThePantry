"""
Hold routes — exposes reservation/hold management endpoints.
"""
from flask import Blueprint, jsonify, request, current_app
from services.hold_service import HoldService

hold_bp = Blueprint("holds", __name__, url_prefix="/api/v1/holds")


@hold_bp.route("", methods=["POST"])
def create_hold():
    """
    Reserve a donation for a user.

    POST /api/v1/holds
    Body: { "userId": int, "donationId": string }

    Returns:
        201: Hold created successfully with hold and donation details.
        400: Missing required fields (userId, donationId).
        409: Donation is already held or not found.
    """
    data = request.get_json()
    if not data or "userId" not in data or "donationId" not in data:
        return jsonify({"error": "userId and donationId are required"}), 400

    reservation_svc = current_app.config["RESERVATION_SERVICE"]
    result = reservation_svc.request_hold(data["userId"], data["donationId"])

    if not result["success"]:
        return jsonify({"error": result["error"]}), 409

    return jsonify(result), 201


@hold_bp.route("", methods=["GET"])
def list_holds():
    """
    List holds for a user.

    GET /api/v1/holds?userId=...&active=true

    Query Params:
        userId (int): Required. ID of the user.
        active (str): If "true", returns only active holds. Defaults to "false".

    Returns:
        200: JSON array of hold objects.
        400: Missing userId query param.
    """
    user_id = request.args.get("userId", type=int)
    if not user_id:
        return jsonify({"error": "userId query param is required"}), 400

    active_only = request.args.get("active", "false").lower() == "true"

    if active_only:
        holds = HoldService.get_active_holds_for_user(user_id)
    else:
        holds = HoldService.get_all_holds_for_user(user_id)

    return jsonify([h.to_dict() for h in holds]), 200


@hold_bp.route("/<int:hold_id>", methods=["DELETE"])
def cancel_hold(hold_id):
    """
    Cancel a hold, returning the donation to the available pool.

    DELETE /api/v1/holds/<holdId>

    Args:
        hold_id: Path parameter. Primary key of the hold to cancel.

    Returns:
        200: Hold cancelled successfully.
        404: Hold not found or not active.
    """
    reservation_svc = current_app.config["RESERVATION_SERVICE"]
    result = reservation_svc.cancel_hold(hold_id)

    if not result["success"]:
        return jsonify({"error": result["error"]}), 404

    return jsonify(result), 200


@hold_bp.route("/<int:hold_id>/pickup", methods=["POST"])
def confirm_pickup(hold_id):
    """
    Confirm that a donation has been picked up.

    POST /api/v1/holds/<holdId>/pickup

    Marks the hold as completed and records in pickup history.

    Args:
        hold_id: Path parameter. Primary key of the hold to complete.

    Returns:
        200: Pickup confirmed, history record created.
        404: Hold not found or not active.
    """
    reservation_svc = current_app.config["RESERVATION_SERVICE"]
    result = reservation_svc.confirm_pickup(hold_id)

    if not result["success"]:
        return jsonify({"error": result["error"]}), 404

    return jsonify(result), 200