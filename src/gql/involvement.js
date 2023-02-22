import gql from "graphql-tag";

export const involvement = gql`
    query involvement($InvolvementInput: InvolvementInput!){
        involvement(data: $InvolvementInput){
            initial,
            kpiGrade,
            kpiTotal,
            kpiDescription,
            bgOtherGrade,
            bgOtherTotal,
            bgOtherDescription,
            bgCompetitionGrade,
            bgCompetitionDescription,
            bgTrainerGrade,
            bgTrainerDescription,
            additionalClass {
                courseSubject,
                date,
                shift,
                class
            }
            petition {
                petitionTitle,
                mode,
                date
            }
            switchTeaching {
                assistantFrom,
                totalForMe,
                totalForYou
            }
        }
    }
`;

export const involvementAll = gql`
    query involvementAll($InvolvementInput: InvolvementInput!){
        involvementAll(data: $InvolvementInput) {
            initial
            kpiGrade
            kpiTotal
            kpiDescription
            bgOtherGrade
            bgOtherTotal
            bgOtherDescription
            bgCompetitionGrade
            bgCompetitionDescription
            bgTrainerGrade
            bgTrainerDescription
            additionalClass {
                courseSubject
                date
                shift,
                class
            }
            petition {
                petitionTitle,
                mode,
                date
            }
            switchTeaching {
                assistantFrom
                totalForMe
                totalForYou
            }
        }
    }
`;
