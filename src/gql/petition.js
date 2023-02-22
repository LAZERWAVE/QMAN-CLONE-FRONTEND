import gql from "graphql-tag";

export const petitions = gql`
    query petitions($SelectPetition : SelectPetition!){
        petitions(data: $SelectPetition){
            petitionID,
            petitionTitle,
            petitionDescription,
            petitionCreator,
            petitionMaxSlot,
            date,
            ongoing,
            mode,
            petitionDetails{
                petitionDetailID,
                assistant,
                approved,
                shift,
                location,
                kpiPoint,
                bgPoint
            }
        }
    }
`;

export const createPetition = gql`
    mutation createPetition($CreatePetitionInput : CreatePetitionInput!){
        createPetition(data: $CreatePetitionInput) {
            petitionID,
            petitionTitle,
            petitionDescription,
            petitionCreator,
            petitionMaxSlot,
            date,
            ongoing,
            mode,
            petitionDetails{
                petitionDetailID,
                assistant,
                approved,
                shift,
                location,
                kpiPoint,
                bgPoint
            }
        }
    }
`;

export const createPetitionDetail = gql`
    mutation createPetitionDetail($CreatePetitionDetailInput : CreatePetitionDetailInput!){
        createPetitionDetail(data: $CreatePetitionDetailInput) {
            petitionDetailID
        }
    }
`;

export const updatePetition = gql`
    mutation updatePetition($ID: ID!, $UpdatePetitionInput : UpdatePetitionInput!){
        updatePetition(id: $ID, data: $UpdatePetitionInput){
            petitionID,
            petitionTitle,
            petitionDescription,
            petitionCreator,
            petitionMaxSlot,
            date,
            ongoing,
            mode
        }
    }
`;

export const updatePetitionOngoing = gql`
    mutation updatePetition($ID: ID!, $UpdatePetitionInput : UpdatePetitionInput!){
        updatePetition(id: $ID, data: $UpdatePetitionInput){
            ongoing
        }
    }
`;

export const deletePetition = gql`
    mutation deletePetition($ID : ID!){
        deletePetition(id: $ID){
            petitionID,
            petitionTitle,
            petitionDescription,
            petitionCreator,
            petitionMaxSlot,
            date,
            ongoing,
            mode
        }
    }
`;

export const deleteAllPetitionDetail = gql`
    mutation ($ID: ID!){
        deleteAllPetitionDetail(id: $ID){
            count
        }
    }
`;

export const createAllPetitionDetail = gql`
    mutation createAllPetitionDetail($CreateAllPetitionDetailInput : CreateAllPetitionDetailInput!){
        createAllPetitionDetail(data: $CreateAllPetitionDetailInput){
            count
        }
    }
`;
