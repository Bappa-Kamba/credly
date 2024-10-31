from flask import Blueprint, request
from .controller import waec_request_handler, neco_request_handler
from time import sleep

verification_routes = Blueprint('verification_routes', __name__)


@verification_routes.route('/waec', methods=['POST'])
def verify_waec():
    sleep(3)
    return waec_request_handler(request)

@verification_routes.route('/neco', methods=['GET', 'POST'])
def verify_neco():
    sleep(3)
    return neco_request_handler(request)
