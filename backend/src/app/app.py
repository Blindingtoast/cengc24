from flask import Flask, jsonify, request
from .models import db, Item
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@db:5432/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

CORS(app)


@app.route('/api/items', methods=['GET', 'POST'])
def items():
    if request.method == 'GET':
        items = Item.query.all()
        return jsonify([item.to_dict() for item in items])
    elif request.method == 'POST':
        data = request.json
        new_item = Item(name=data['name'])
        db.session.add(new_item)
        try:
            db.session.commit()
            return jsonify(new_item.to_dict()), 201
        except SQLAlchemyError:
            db.session.rollback()
            return jsonify({'error': 'Could not save item'}), 500


def main():
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=8000)
