"""
User routes — exposes user registration and lookup endpoints.
"""
from flask import Blueprint, jsonify, request
from services.user_service import UserService

user_bp = Blueprint("users", __name__, url_prefix="/api/v1/users")


@user_bp.route("", methods=["POST"])
def create_or_get_user():
    """
    Get existing user by email, or create a new one.

    POST /api/v1/users
    Body: { "email": string, "name": string }

    Returns:
        201: Newly created user with ``{"user": {...}, "created": true}``.
        200: Existing user found with ``{"user": {...}, "created": false}``.
        400: Missing required fields (email, name).
    """
    data = request.get_json()
    if not data or "email" not in data or "name" not in data:
        return jsonify({"error": "email and name are required"}), 400

    user, created = UserService.get_or_create_user(data["email"], data["name"])
    status = 201 if created else 200
    return jsonify({"user": user.to_dict(), "created": created}), status


@user_bp.route("/lookup", methods=["GET"])
def lookup_user():
    """
    Look up a user by email address.

    GET /api/v1/users/lookup?email=...

    Query Params:
        email (str): Required. Email address to search for.

    Returns:
        200: User object if found.
        400: Missing email query param.
        404: No user with that email exists.
    """
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "email query param is required"}), 400

    user = UserService.get_user_by_email(email)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200