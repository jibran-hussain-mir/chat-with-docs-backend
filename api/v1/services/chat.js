async function answerUsersQuestion(req, res) {
    try {
        const documentId = req.body.documentId;
        const context = req.body.context;
        const question = req.body.question;
        
    } catch(error) {
        
        console.log('Error in answerUsersQuestion method', error);
    }
} 

const chatService = {
    answerUsersQuestion: answerUsersQuestion
}

export default chatService;