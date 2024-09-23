from flask import jsonify
from .service import verify_document, verify_document_dummy
from .validate_info import validate
import re


def validate_request(data):
    """Function to validate the incoming data"""
    required_fields = ['PIN', 'ExamType', 'ExamYear', 'CandidateNo',
                       'ExamName', 'Name', 'CentreName', 'subjects']

    # Check for missing fields
    missing_fields = [
        field for field in required_fields if not data.get(field)]
    if missing_fields:
        return False, f"Missing fields: {', '.join(missing_fields)}"

    # Validate PIN length (WAEC and NECO pins are typically 10-16 digits)
    if len(data['PIN']) not in range(10, 21) or not data['PIN'].isdigit():
        return False, "PIN must be a number between 10 and 20 digits."

    # Validate CandidateNo (should be numeric and of appropriate length)
    if len(data['CandidateNo']) != 10 or not data['CandidateNo'].isdigit():
        return False, "Candidate number must be 10 digits."

    # Validate ExamYear (should be a valid year)
    str_exam_year = str(data['ExamYear'])
    if not re.match(r'^\d{4}$', str_exam_year):
        return False, "Exam year must be a 4-digit number."

    return True, None


def waec_request_handler(request):
    """ Function to handle WAEC requests """
    try:
        data = request.json

        # Validate the incoming data
        is_valid, validation_error = validate_request(data)
        if not is_valid:
            # Return 400 for validation errors
            return jsonify({"error": validation_error}), 400

        # Extract validated fields
        pin = data['PIN']
        ExamYear = data['ExamYear']
        CandidateNo = data['CandidateNo']
        ExamName = data['ExamName']
        serial = data['serial']

        # Call the verify_document function
        result, status_code = verify_document_dummy(
            # CandidateNo, ExamYear, pin, ExamName, serial
        )

        # Check if validation was successful
        if status_code == 200:
            # Extract the parsed data from the result
            parsed_data = result.get_json()['content']['message']

            # Validate the user data against the parsed data
            validated_data = validate(data, parsed_data)
            print(validated_data)

            if validated_data['Info Match'] and \
            validated_data['Subj Match']:
                return jsonify({
                    "success": True,
                    "content": parsed_data,
                }), status_code
            else:
                # If there are mismatches, return the mismatches in the response
                return jsonify({
                    "success": True,
                    "mismatch": True,
                    "content": parsed_data,
                    "mismatches": {
                        "Info Mismatches": validated_data['Info Mismatches'],
                        "Subj Mismatches": validated_data['Subj Mismatches'],
                    }
                }), 422  # Use 422 Unprocessable Entity for mismatches

        else:
            error = result.get_json()['content']['error_message']
            return jsonify({
                "success": False,
                "content": error,
            }), status_code

    except ValueError as ve:
        print(f"ValueError in request_handler: {ve}")
        # Handle data format issues
        return jsonify({"error": "Invalid data format"}), 400
    except TypeError as te:
        print(f"TypeError in request_handler: {te}")
        # Handle type errors
        return jsonify({"error": "Type error occurred"}), 400
    except Exception as e:
        print(f"Error in request_handler: {e}")
        # Catch-all for server errors
        return jsonify({"error": "An unexpected error occurred"}), 500


def neco_request_handler(request):
    """ Function to handle NECO requests """
    pass