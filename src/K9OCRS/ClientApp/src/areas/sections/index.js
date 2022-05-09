import React, { useState } from 'react';
import { connect } from 'react-redux';
// import { Container, Row, Spinner } from 'reactstrap';
import PageHeader from '../../shared/components/PageHeader';
import PageBody from '../../shared/components/PageBody';
import selectors from '../../shared/modules/selectors';


const MySections = () => {

    //const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    //const [allSections, setAllSections] = useState([]);


    // useEffect(() => {
    //     async function getTest() {
    //         try {
    //             const res = await classTypesClient.getAllClassTypes(false, false);
    //             setClassTypes(res?.data);
    //             setLoading(false);
    //         } catch (err) {
    //             setLoading(false);
    //             setAlerts([
    //                 {
    //                     color: 'danger',
    //                     message: "We're having issues retrieving the list of classes.",
    //                 },
    //             ]);
    //         }
    //     }
    //     getTest();
    // }, []);

    return (
        <div>
            <PageHeader
                title="My Account"
                breadCrumbItems={[
                    { label: 'My Account', path: '/Account' },
                    { label: 'My Sections', active: true },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            >
            </PageHeader>
            <PageBody>
                <p>Something is coming this way soon</p>
            
            </PageBody>
        </div>
    );
};

export default connect(
    (state) => ({
        currentUser: selectors.selectCurrentUser(state),
    }),
    {}
)(MySections);
