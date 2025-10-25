from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
import os
import json
import uuid
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__,
            template_folder='templates',
            static_folder='static')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')
socketio = SocketIO(app, cors_allowed_origins="*")

# In-memory storage for movies
movies = {}
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'kinotop007')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/stream/<movie_code>')
def stream(movie_code):
    if movie_code in movies:
        return render_template('stream.html', movie=movies[movie_code])
    return "Movie not found", 404

@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)
    emit('status', {'msg': f'Joined room {room}'}, room=room)

@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    emit('status', {'msg': f'Left room {room}'}, room=room)

@socketio.on('stream_movie')
def stream_movie(data):
    movie_code = data['movie_code']
    if movie_code in movies:
        movie = movies[movie_code]
        # In a real implementation, you'd read the movie file in chunks
        # For demo purposes, we'll simulate streaming
        emit('movie_chunk', {'data': 'Simulated movie data'}, room=movie_code)

@app.route('/api/movies', methods=['GET'])
def get_movies():
    return jsonify(list(movies.values()))

@app.route('/api/movies', methods=['POST'])
def add_movie():
    try:
        data = request.json
        if not data or not all(k in data for k in ['name', 'type', 'image', 'code']):
            return jsonify({'success': False, 'error': 'Barcha maydonlarni to\'ldiring'}), 400

        movie_code = data['code'].upper().strip()
        if not movie_code:
            return jsonify({'success': False, 'error': 'Kino kodi bo\'sh bo\'lishi mumkin emas'}), 400

        if movie_code in movies:
            return jsonify({'success': False, 'error': 'Bu kod allaqachon mavjud'}), 400

        movie = {
            'code': movie_code,
            'name': data['name'],
            'type': data['type'],
            'image': data['image']
        }
        movies[movie_code] = movie
        return jsonify({'success': True, 'movie': movie})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/movies/<movie_code>', methods=['DELETE'])
def remove_movie(movie_code):
    try:
        movie_code = movie_code.upper().strip()
        if movie_code in movies:
            del movies[movie_code]
            return jsonify({'success': True})
        return jsonify({'success': False, 'error': 'Kino topilmadi'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/auth', methods=['POST'])
def auth():
    try:
        data = request.json
        if not data or 'password' not in data:
            return jsonify({'success': False, 'error': 'Parol kerakli'}), 400

        password = data['password']
        if password == ADMIN_PASSWORD:
            return jsonify({'success': True})
        return jsonify({'success': False, 'error': 'Noto\'g\'ri parol'}), 401
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/images/<path:path>')
def serve_images(path):
    return send_from_directory('images', path)

# For production deployment with gunicorn
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    socketio.run(app, host='0.0.0.0', port=port, debug=False)