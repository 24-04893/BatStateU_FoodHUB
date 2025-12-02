from flask import Flask, jsonify, send_from_directory, abort, request
import json
import os

app = Flask(__name__, static_folder='')


@app.route('/api/stalls')
def api_stalls():
    data_path = os.path.join(app.root_path, 'data', 'stalls.json')
    if not os.path.exists(data_path):
        abort(404)
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify(data)


@app.route('/api/menu-states')
def api_menu_states():
    data_path = os.path.join(app.root_path, 'data', 'menu_states.json')
    if not os.path.exists(data_path):
        return jsonify({})
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify(data)


@app.route('/api/menu-states/<int:stall_id>', methods=['POST'])
def save_menu_state(stall_id):
    # Parse JSON payload
    try:
        payload = request.get_json()
    except Exception as e:
        return jsonify({'error': 'Invalid JSON'}), 400
    if payload is None:
        return jsonify({'error': 'Missing JSON body'}), 400

    # Load or create menu states
    states_path = os.path.join(app.root_path, 'data', 'menu_states.json')
    states = {}
    if os.path.exists(states_path):
        try:
            with open(states_path, 'r', encoding='utf-8') as f:
                states = json.load(f)
        except Exception:
            states = {}

    # Update state for stall
    states[str(stall_id)] = payload

    # Persist to file
    try:
        os.makedirs(os.path.dirname(states_path), exist_ok=True)
        with open(states_path, 'w', encoding='utf-8') as f:
            json.dump(states, f, ensure_ascii=False, indent=2)
        return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'error': f'Failed to write file: {str(e)}'}), 500


@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def static_proxy(path):
    # Serve static files; fallback to index.html
    full_path = os.path.join(app.root_path, path)
    if os.path.isdir(full_path):
        abort(404)
    if os.path.exists(full_path):
        return send_from_directory(app.root_path, path)
    return send_from_directory(app.root_path, 'index.html')


if __name__ == '__main__':
    # Run Flask on port 8000
    app.run(host='0.0.0.0', port=8000, debug=True)
