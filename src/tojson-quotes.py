import requests
from bs4 import BeautifulSoup
import re
import json


# get content
req = requests.get(
    "https://docs.google.com/document/d/1B7MUQFnMzgEBi-z0o2QsG-hHXcAOOsIbx4dPGrtVTNM/mobilebasic")
print(req.status_code)
soup = BeautifulSoup(req.content, 'html.parser')
doc = soup.find('div', {'class': "doc"}).find('div')

lines = []
for child in doc.children:
    if child.name == 'hr':
        lines.append("<hr>")
    if child.name == 'p':
        lines.append(child.text.strip())
    if child.name == 'ul':
        for ele in child.children:
            if ele.name != 'li':
                continue
            lines.append(ele.text.strip())
doc = '\n'.join(lines)
doc = re.sub(r'\n+', '\n', doc.strip())
QUOTES, LINKS = doc.split("\n<hr>\n")[:2]


# quotes
lines = [_.strip() for _ in QUOTES.strip().split('\n')]
key = ""
result = {}

for line in lines:
    if line == "":
        continue

    # test of is category
    regex = re.compile(r"^([A-Z]+)\:*\s\(([0-9\.]+)\)$")
    match = regex.match(line)
    if match:
        key = match.group(1)
        probability = float(match.group(2))
        result[key] = {
            "probability": probability,
            "objects": []
        }
        continue

    # otherwise: quote
    regex = re.compile(r"(.+?)\s*\(([0-9\.]+)\)")
    match = regex.match(line)
    if match:
        quote = match.group(1)
        weight = match.group(2)
        result[key]["objects"].append({
            "text": quote,
            "weight": int(weight)
        })
        continue

    raise ValueError("Unknown line: " + line)

with open("src/quotes.json", "w") as fp:
    json.dump(result, fp)


# links
lines = [_.strip() for _ in LINKS.strip().split('\n')]
key = ""
result = {}

for line in lines:
    if line == "":
        continue

    # test of is category
    regex = re.compile(r"^([A-Z]+)\:*\s\(([0-9\.]+)\)$")
    match = regex.match(line)
    if match:
        key = match.group(1)
        probability = float(match.group(2))
        result[key] = {
            "probability": probability,
            "objects": []
        }
        continue

    # otherwise: quote
    regex = re.compile(r"(https\:\/\/.+?)\s*\|\s*(.+?)\s*\(([0-9\.]+)\)")
    match = regex.match(line)
    if match:
        link = match.group(1)
        alt = match.group(2)
        weight = match.group(3)
        result[key]["objects"].append({
            "text": link,
            "alt": alt,
            "weight": int(weight)
        })
        continue

    raise ValueError("Unknown line: " + line)

with open("src/links.json", "w") as fp:
    json.dump(result, fp)
