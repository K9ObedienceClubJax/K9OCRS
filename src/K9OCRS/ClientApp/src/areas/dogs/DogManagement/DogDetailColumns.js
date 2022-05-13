const DogDetailColumns = [
    {
        Header: 'Dog',
        accessor: 'dogName',
        //Cell: alignmentWrapper('center', classTypeTemplate),
    },
    {
        Header: 'Breed',
        accessor: 'dogBreed',
        //Cell: alignmentWrapper('center', classSectionTemplate),
    },
    {
        Header: "Age",
        //accessor: (row) => ({ id: row.dogID, name: row.dogName, profilePictureUrl: row.dogProfilePictureUrl }),
        //Cell: alignmentWrapper('left', dogTemplate),
    },
    {
        Header: 'Completed Classes',
        accessor: 'completedClasses',
        //Cell: alignmentWrapper('center'),
    },
    {
        Header: 'Active Classes',
        accessor: 'activeClasses',
        //Cell: alignmentWrapper('center'),
    },
    {
        Header: 'Pending Applications',
        accessor: 'pendingApplications',
        //Cell: alignmentWrapper('center', checkMarkTemplate),
    },
    {
        Header: 'Vaccination Status',
        accessor: 'vaccinationStatus',
        //Cell: alignmentWrapper('center', checkMarkTemplate),
    },
];

export default DogDetailColumns;