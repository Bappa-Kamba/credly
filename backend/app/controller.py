from flask import jsonify
from .service import (
    verify_waec_result,
    verify_neco_result,
    verify_document_dummy,
    verify_neco_dummy
)
from .validate_info import validate
import re


def validate_request(data):
    """Function to validate the incoming data"""
    required_fields = ['PIN', 'ExamType', 'ExamYear', 'CandidateNo',
                       'ExamName', 'Name', 'subjects']

    # Check for missing fields
    missing_fields = [
        field for field in required_fields if not data.get(field)]
    if missing_fields:
        return False, f"Missing fields: {', '.join(missing_fields)}"

    # Validate PIN length (WAEC and NECO pins are typically 10-16 digits)
    if len(data['PIN']) not in range(10, 21) or not data['PIN'].isdigit():
        return False, "PIN must be a number between 10 and 20 digits."

    # Validate CandidateNo (should be numeric and of appropriate length)
    if len(data['CandidateNo']) not in range(10, 21):
        return False, "Candidate number must be between 10 and 15 digits."

    # Validate ExamYear (should be a valid year)
    str_exam_year = str(data['ExamYear'])
    if not re.match(r'^\d{4}$', str_exam_year):
        return False, "Exam year must be a 4-digit number."

    return True, None


def generate_mismatch_response(user_data, parsed_data, validated_data, exam_type="WAEC"):
    """
    Utility function to handle mismatches in response, while converting 
    user_data to match the parsed_data structure for frontend compatibility.
    """
    
    # Transform user_data subjects to the format of parsed_data['subject_grades']
    transformed_user_subjects = [
        {"subject": sub['subject'], "grade": sub['grade']}
        for sub in user_data.get('subjects', [])
    ]
    
    # Include additional subjects from parsed_data that are missing in user_data
    parsed_subject_names = {sub['subject'] for sub in parsed_data['subject_grades']}
    for subject in transformed_user_subjects:
        if subject['subject'] not in parsed_subject_names:
            subject['grade'] = "N/A"  # Mark missing subjects with "N/A"
    
    # Reconstruct the content with the transformed user data structure
    content = {
        "candidate_info": parsed_data['candidate_info'],
        "subject_grades": transformed_user_subjects,
    }
    if exam_type == 'WAEC':
        content["card_info"] = parsed_data['card_info']

    return jsonify({
        "success": True,
        "mismatch": True,
        "content": content,
        "mismatches": {
            "Info Mismatches": validated_data['Info Mismatches'],
            "Subj Mismatches": validated_data['Subj Mismatches'],
        }
    }), 422


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
            # print(validated_data)

            if validated_data['Info Match'] and \
            validated_data['Subj Match']:
                return jsonify({
                    "success": True,
                    "content": parsed_data,
                }), status_code
            else:
                return generate_mismatch_response(data, parsed_data, validated_data)

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

        # Call the verify_document function
        result, status_code = verify_neco_dummy(
            # CandidateNo, ExamYear, pin, ExamName
        )


        # Check if validation was successful
        if status_code == 200:
            # Extract the parsed data from the result
            parsed_data = result.get_json()['content']['message']

            validated_data = validate(data, parsed_data)

            if validated_data['Info Match'] and \
                    validated_data['Subj Match']:
                return jsonify({
                    "success": True,
                    "content": parsed_data,
                }), status_code
            else:
                return generate_mismatch_response(data, parsed_data, validated_data, "NECO")

        else:
            error = result.get_json()['content']['error_message']['info']
            message = result.get_json()['content']['error_message']['message']
            return jsonify({
                "success": False,
                "message": message,
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
