import gql from "graphql-tag";

export const additionalClass = gql`
    query($SelectAdditionalClass: SelectAdditionalClass!){
        additionalClass(data: $SelectAdditionalClass){
            additionalClassID,
            courseSubject,
            assistantInitial1,
            assistantInitial2,
            additionalClassDetails{
                additionalClassDetailID,
                studentNIM,
                studentName
            },
            class,
            date,
            shift,
            location,
            done
        }
    }
`;

export const additionalClassWithParticipant = gql`
    query additionalClass($SelectAdditionalClass: SelectAdditionalClass){
        additionalClass(data: $SelectAdditionalClass){
            additionalClassID,
            courseSubject,
            assistantInitial1,
            assistantInitial2,
            additionalClassDetails{
                additionalClassDetailID,
                studentNIM,
                studentName
            },
            class,
            date,
            shift,
            location,
            done,
            valid,
            totalStudent
        }
    }
`;

export const additionalClassStudent = gql`
    query($SelectAdditionalClassStudent: SelectAdditionalClassStudent!){
        additionalClassStudent(data: $SelectAdditionalClassStudent){
            additionalClassID,
            courseSubject,
            assistantInitial1,
            assistantInitial2,
            date,
            shift,
            location
        }
    }
`;

export const createAdditionalClass = gql`
    mutation createAdditionalClass($CreateAdditionalClassInput: CreateAdditionalClassInput!){
        createAdditionalClass(data: $CreateAdditionalClassInput){
            additionalClassID,
            courseSubject,
            assistantInitial1,
            assistantInitial2,
            additionalClassDetails{
                additionalClassDetailID,
                studentNIM,
                studentName
            },
            class,
            date,
            shift,
            location,
            done
        }
    }
`;

export const createAdditionalClassDetail = gql`
    mutation createAdditionalClassDetail($CreateAdditionalClassDetailInput : CreateAdditionalClassDetailInput!){
        createAdditionalClassDetail(data: $CreateAdditionalClassDetailInput){
            additionalClassDetailID
        }
    }
`;

export const updateAdditionalClass = gql`
    mutation updateAdditionalClass($ID: ID!, $UpdateAdditionalClassInput : UpdateAdditionalClassInput!){
        updateAdditionalClass(id: $ID,data: $UpdateAdditionalClassInput){
            additionalClassID,
            courseSubject,
            assistantInitial1,
            assistantInitial2,
            additionalClassDetails{
                additionalClassDetailID,
                studentNIM,
                studentName
            },
            class,
            date,
            shift,
            location,
            done
        }
    }
`;

export const updateAdditionalClassDone = gql`
    mutation updateAdditionalClass($ID: ID!, $UpdateAdditionalClassInput : UpdateAdditionalClassInput!){
        updateAdditionalClass(id: $ID,data: $UpdateAdditionalClassInput){
            additionalClassID
        }
    }
`;

export const deleteAdditionalClass = gql`
    mutation deleteAdditionalClass($ID: ID!){
        deleteAdditionalClass(id: $ID){
            additionalClassID
        }
    }
`;
