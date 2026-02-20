"""
Donation routes — exposes donation listing endpoints.
"""
from flask import Blueprint, jsonify, request, current_app

donation_bp = Blueprint("donations", __name__, url_prefix="/api/v1/donations")


@donation_bp.route("", methods=["GET"])
def list_donations():
    """
    List available donations.

    GET /api/v1/donations?lat=...&lng=...&radius=...&showAll=true

    Query Params:
        lat (float): Latitude of search center. Defaults to 0.
        lng (float): Longitude of search center. Defaults to 0.
        radius (float): Search radius in miles. Defaults to 50.
        showAll (str): If "true", includes held donations with isHeld flag.
            Defaults to "false".

    Returns:
        200: JSON array of donation objects. Each donation includes an
             isHeld flag when showAll=true.
    """
    lat = request.args.get("lat", 0, type=float)
    lng = request.args.get("lng", 0, type=float)
    radius = request.args.get("radius", 50, type=float)
    show_all = request.args.get("showAll", "false").lower() == "true"

    reservation_svc = current_app.config["RESERVATION_SERVICE"]

    if show_all:
        donations = reservation_svc.get_all_donations(lat, lng, radius)
    else:
        donations = reservation_svc.get_available_donations(lat, lng, radius)

    return jsonify(donations), 200