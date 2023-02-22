import gql from "graphql-tag";

export const transactionAssistant = gql`
    query transactionAssistant($TransactionAssistantInput: TransactionInput!){
        transactionAssistant(data: $TransactionAssistantInput){
            courseID,
            courseSubject,
            assistantInitial1,
            assistantInitial2,
            class
        }
    }
`;

export const transactionStudent = gql`
    query($TransactionInput: TransactionInput!) {
        transactionStudent(data: $TransactionInput) {
            courseID
            courseSubject
            class
            assistantInitial1
            assistantInitial2
        }
    }
`;
