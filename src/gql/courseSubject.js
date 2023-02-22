import gql from "graphql-tag";

export const getCourseSubject = gql`
    query getCourseSubject($TransactionInput : TransactionInput!){
        getCourseSubject(data: $TransactionInput){
            courseSubjectID
            courseSubjectDescription
        }
    }
`;
