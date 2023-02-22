import gql from "graphql-tag";

export const loginAssistant = gql`
    query loginAssistant($LoginInput: LoginInput!){
        loginAssistant(data: $LoginInput){ 
            accessToken,
            accessTokenMessier,
            expires,
            type 
        }
    }
`;

export const loginStudent = gql`
    query loginStudent($LoginInput: LoginInput!){
        loginStudent(data: $LoginInput){ accessToken, type }
    }
`;
