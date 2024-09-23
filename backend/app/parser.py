from bs4 import BeautifulSoup


def parse_candidate_info(soup):
    candidate_info = {}
    candidate_table = soup.find('table', {'id': 'tbCandidInfo'})
    for row in candidate_table.find_all('tr'):
        cells = row.find_all('td')
        key = cells[0].get_text(strip=True)
        value = cells[1].get_text(strip=True)
        candidate_info[key] = value
    return candidate_info


def parse_subject_grades(soup):
    subject_grades = []
    subject_table = soup.find('table', {'id': 'tbSubjectGrades'})
    for row in subject_table.find_all('tr'):
        cells = row.find_all('td')
        subject = cells[0].get_text(strip=True)
        grade = cells[1].get_text(strip=True)
        subject_grades.append({'subject': subject, 'grade': grade})
    return subject_grades


def parse_card_info(soup):
    card_info = {}
    card_table = soup.find('table', {'id': 'tbCardInfo'})
    for row in card_table.find_all('tr'):
        cells = row.find_all('td')
        key = cells[0].get_text(strip=True)
        value = cells[1].get_text(strip=True)
        card_info[key] = value
    return card_info


def parse_html_response(html_content):
    # Create a BeautifulSoup object and specify the parser
    soup = BeautifulSoup(html_content, 'lxml')

    # Parse different sections of the HTML
    candidate_info = parse_candidate_info(soup)
    subject_grades = parse_subject_grades(soup)
    card_info = parse_card_info(soup)

    # Combine and return parsed data
    return {
        'candidate_info': candidate_info,
        'subject_grades': subject_grades,
        'card_info': card_info
    }
