from flask import Flask, render_template,jsonify
import json
import os

app = Flask(__name__)

@app.route('/')
def index():

    # file1_path = os.path.join(app.static_folder, 'files', 'airbases-by-continent-two.json')
    # file2_path = os.path.join(app.static_folder, 'files', 'airbases-and-alliances.json')

    # with open(file1_path, 'r') as file1:
    #     data1 = json.load(file1)

    # # Load the second JSON file
    # with open(file2_path, 'r') as file2:
    #     data2 = json.load(file2)

    # # Combine data based on a unique identifier (e.g., 'icao' in this example)
    # combined_data = {}


    # for obj in data1:
    #     icao = obj.get('icao')
    #     obj['alliances'] = "No Alliances"  # Set alliances to None if not present
    #     combined_data[icao] = obj

    # for obj in data2:
    #     icao = obj.get('icao')
    #     if icao not in combined_data:
    #         obj['alliances'] = "No Alliances"  # Set alliances to None if not present
    #         combined_data[icao] = obj
    #     else:
    #         # Handle merging or updating fields in case of conflicts
    #         # For example, you might want to update 'alliances' field
    #         alliances = obj.get('alliances')
    #         combined_data[icao]['alliances'] = alliances if alliances else None

    
    # # Convert the combined data to a list of dictionaries
    # result = list(combined_data.values())

    # output_file_path = os.path.join(app.static_folder, 'files', 'combined_data_airbases.json')
    # with open(output_file_path, 'w') as output_file:
    #     json.dump(result, output_file)

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
