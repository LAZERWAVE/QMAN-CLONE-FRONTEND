import gql from "graphql-tag";

export const getSemester = gql`
    query getSemester{
        getSemester{
            semesterID,
            description
        }
    }
`;
