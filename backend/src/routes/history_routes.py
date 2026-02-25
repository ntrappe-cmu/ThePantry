"""
History routes — exposes pickup history endpoints.
"""
from flask import Blueprint, jsonify, request
from services.history_service import HistoryService

history_bp = Blueprint("history", __name__, url_prefix="/api/v1/history")


@history_bp.route("", methods=["GET"])
def get_history():
    """
    Retrieve all completed pickups for a user, newest first.

    GET /api/v1/history?userId=...

    Query Params:
        userId (int): Required. ID of the user whose history to retrieve.

    Returns:
        200: JSON array of pickup history records.
        400: Missing userId query param.
    """
    user_id = request.args.get("userId", type=int)
    if not user_id:
        return jsonify({"error": "userId query param is required"}), 400

    records = HistoryService.get_history_for_user(user_id)
    return jsonify([r.to_dict() for r in records]), 200