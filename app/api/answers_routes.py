from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from app.models import Answer, db
from app.forms import AnswerForm

answers_routes = Blueprint("answers", __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@answers_routes.route("", methods=["GET"])
def get_all_answers():
    answers = Answer.query.all(request.questionId)
    return { answer.id: answer.to_dict() for answer in answers }


@answers_routes.route("/<int:id>", methods=["PUT"])
@login_required
def edit_answer(id):

  answer = Answer.query.get(id)

  form = AnswerForm()

  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():

    new_body = form.data['body']


    answer.body = new_body


    db.session.commit()

  return answer.to_dict()


@answers_routes.route("", methods=["POST"])
@login_required
def add_answer():

  """
  Presents a form to create a question
  """

  form = AnswerForm()

  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():

    answer = Answer(
      question_id = request.question_id,
      user_id = current_user.id,
      body = form.data['body'],

    )

    db.session.add(answer)
    db.session.commit()
    return answer.to_dict()


  return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@answers_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_question(id):
  answer = Answer.query.get(id)
  db.session.delete(answer)
  db.session.commit()
  return ('Delete Successful')