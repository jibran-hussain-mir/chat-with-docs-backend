import helper from '../../../utils/helper.js';

async function answerUsersQuestion(req, res) {
    try {
        // const documentId = req.body.documentId;
        // const context = req.body.context;
        // const question = req.body.question;

        const documentPath = './documents/historyOfKashmir.txt'
        const response = await helper.splitTextIntoChunks('recursiveCharacter', { 
            filePath: documentPath,
            chunkSize: 1000,
            chunkOverlap: 200
         });
         console.log('Response from splitTextIntoChunks', response)
        
    } catch(error) {
        
        console.log('Error in answerUsersQuestion method', error);
    }
} 

const chatService = {
    answerUsersQuestion: answerUsersQuestion
}

export default chatService;