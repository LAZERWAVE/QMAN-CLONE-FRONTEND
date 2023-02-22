import gql from "graphql-tag";

export const profileStudent = gql`
    query profileStudent{
        profileStudent{
            binusianID,
            birthDate,
            name,
            pictureID,
            username
        }
    }
`;

export const profileAssistant = gql`
    query profileAssistant{
        profileAssistant{
            binusianID,
            name,
            username,
            pictureID,
        }
    }
`;
