""" Update product.json file.
"""
import json
from datetime import datetime

# Load the first JSON file to get the new score
with open('assessments/Claims Fraud Detection AI-admin-p1-2025-05-20-18-46-52.json', 'r') as file1:
    data1 = json.load(file1)

# Extract the score and necessary details from the first JSON
new_score = data1.get('score')
product_name = data1.get('productName')
pillar_id = data1.get('pillarId')

# Load the second JSON file where the score needs to be updated
with open('src/data/products.json', 'r') as file2:
    data2 = json.load(file2)

# Find the product and update the score
for product in data2['products']:
    if product['name'] == product_name:
        # # Update the scores for the existing assessments
        # for score in product['assessments']:
        #     for pillar_score in score['scores']:
        #         if pillar_score['pillarId'] == pillar_id:
        #             pillar_score['score'] = new_score
        #             break
        
        # Create a new assessment entry
        new_assessment = {
            "id": f"a{len(product['assessments']) + 1}",  # Generate a new ID
            "date": datetime.now().strftime("%Y-%m-%d"),  # Current date
            "scores": [
                {"pillarId": "p1", "score": new_score},
                {"pillarId": "p2", "score": product['assessments'][-1]['scores'][1]['score']},  # Keeping existing scores
                {"pillarId": "p3", "score": product['assessments'][-1]['scores'][2]['score']},
                {"pillarId": "p4", "score": product['assessments'][-1]['scores'][3]['score']},
                {"pillarId": "p5", "score": product['assessments'][-1]['scores'][4]['score']},
                {"pillarId": "p6", "score": product['assessments'][-1]['scores'][5]['score']}
            ],
            "overallScore": sum([
                new_score,
                product['assessments'][-1]['scores'][1]['score'],
                product['assessments'][-1]['scores'][2]['score'],
                product['assessments'][-1]['scores'][3]['score'],
                product['assessments'][-1]['scores'][4]['score'],
                product['assessments'][-1]['scores'][5]['score']
            ]) // 6  # Average of the scores for overall score
        }
        product['assessments'].append(new_assessment)

        break

# Save the updated JSON back to the second file
with open('src/data/products_updated.json', 'w') as file2:
    json.dump(data2, file2, indent=2)

print("Score updated and new assessment added successfully!")

