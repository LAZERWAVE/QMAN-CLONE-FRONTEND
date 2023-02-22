import gql from "graphql-tag";

export const switchTeaching = gql`
    query switchTeaching($SelectSwitchTeaching: SelectSwitchTeaching){
        switchTeaching(data: $SelectSwitchTeaching){
            switchTeachingID,
            assistantFrom,
            assistantTo,
            courseSubject,
            class,
            date,
            shift,
            session,
            approved,
            status
        }
    }
`;

export const createSwitchTeaching = gql`
    mutation($CreateSwitchTeachingInput: CreateSwitchTeachingInput!){
        createSwitchTeaching(data: $CreateSwitchTeachingInput){
            switchTeachingID,
            assistantFrom,
            assistantTo,
            courseSubject,
            class,
            date,
            shift,
            session,
            approved,
            status
        }
    }
`;

export const updateSwitchTeaching = gql`
    mutation updateSwitchTeaching($ID : ID!,$UpdateSwitchTeachingInput : UpdateSwitchTeachingInput!){
        updateSwitchTeaching(id: $ID, data: $UpdateSwitchTeachingInput){
            switchTeachingID,
            assistantFrom,
            assistantTo,
            courseSubject,
            class,
            date,
            shift,
            session,
            approved,
            status
        }
    }
`;

export const deleteSwitchTeaching = gql`
    mutation($ID: ID!){
        deleteSwitchTeaching(id: $ID){
            switchTeachingID
        }
    }
`;
