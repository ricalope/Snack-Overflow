const ADD_ANSWER = 'ask/NEW_ANSWER'
const GET_ANSWERS = 'get/ALL_ANSWERS'
const EDIT_ANSWER = 'edit/ONE_ANSWER'
const DELETE_ANSWER = 'delete/ONE_ANSWER'

const addAnswer = (answer) => ({
    type: ADD_ANSWER,
    payload: answer
})

const allAnswers = (answers) => ({
    type: GET_ANSWERS,
    payload: answers
})

const editAnswer = (answer) => ({
    type: EDIT_ANSWER,
    payload: answer
})

const deleteAnswer = (answer) => ({
    type: DELETE_ANSWER,
    payload: answer
})


export const deleteAnswerThunk = (payload) => async dispatch => {
    const { answer_id } = payload
    const response = await fetch(`/api/answers/${answer_id}`, {
        method: 'DELETE'
    })

    if(response.ok){
        const answer = await response.json()

        dispatch(deleteAnswer(answer))
    }
}

export const editAnswerThunk = (payload) => async dispatch => {
    const { answer_id, body } = payload
    const response = await fetch(`/api/answers/${answer_id}`, {
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body })
    })

    if(response.ok){
        const answer = await response.json()

        dispatch(editAnswer(answer))
    }
}

// export const createAnswerThunk = (payload) => async dispatch => {
//     const { question_id, user_id, body } = payload
//     const response = await fetch(`/api/answers`, {
//         method: 'POST',
//         headers:{
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ question_id, user_id, body })
//     })

//     if(response.ok){
//         const answer = await response.json()

//         dispatch(addAnswer(answer))
//     }
// }
export const createAnswerThunk = (payload) => async dispatch => {
    const { questionId, user_id, body } = payload
    console.log("*****************", payload)
    const response = await fetch(`/api/ask/${questionId}/answers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questionId, user_id, body })
    })

    if (response.ok) {
        const answer = await response.json()

        dispatch(addAnswer(answer))
        return answer
    }
}

export const getAllAnswersThunk = () => async dispatch => {
    const res = await fetch(`/api/answers`);
    if (res.ok) {
        const answers = await res.json()
        dispatch(allAnswers(answers))
        return answers
    }
}


const initialState = { allAnswers: {} }
const answersReducer = (state = initialState, action) => {


    switch(action.type){
        case ADD_ANSWER:{

          if(!state[action.id]){
              const newState = {
                  ...state,
                  [action.payload.id]:{
                      id: action.payload.id,
                      body: action.payload.body
                  }
              };
              return newState
          }
        }

        case GET_ANSWERS: {
            const newState = Object.assign({}, state)
            newState.allAnswers = {}
            const answer = (action.payload)
            newState.allAnswers = answer
            return newState
        }

        case DELETE_ANSWER:{
            const newState = {...state, allAnswers:{...state.allAnswers}}
            delete newState.allAnswers[action.payload];
            return newState;
            }

        case EDIT_ANSWER:
            return {
                ...state,
                [action.payload.id]: action.payload
            }

        default:
            return state;
    }

}

export default answersReducer
