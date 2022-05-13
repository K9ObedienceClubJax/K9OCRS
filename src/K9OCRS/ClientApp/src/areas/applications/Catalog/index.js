import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Spinner } from 'reactstrap';
import { useSearchParams } from 'react-router-dom';
import * as classTypesClient from '../../../util/apiClients/classTypes';
import PageHeader from '../../../shared/components/PageHeader';
import ClassCard from './components/ClassCard';
import CustomPagination from '../../../shared/components/Pagination';
import Search from './components/Search';
import PageBody from '../../../shared/components/PageBody';

const Catalog = () => {
    const itemsPerPage = 8;

    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const [classTypes, setClassTypes] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState((c) => {
        if (searchParams.has('page')) {
            return searchParams.get('page') - 1;
        }
        return 0;
    });

    const isMounted = useRef(false);

    // This actually just updates the page param
    // the actual page change is handled by useEffect
    const handlePageChange = (targetPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', targetPage + 1);
        setSearchParams(params);
    };

    // Calculate the start and end of our paginated subset of class types
    const pageStartIndex = page * itemsPerPage;
    const pageEndIndex = (page + 1) * itemsPerPage;

    let [query, setQuery] = useState('');

    const filteredClasses = classTypes.filter((item) => {
        return item.title.toLowerCase().includes(query.toLowerCase());
        // Commented this out because searching the description could be a bit confusing if people don't realize that the match is there
        // item.description.substring(0, 125).toLowerCase().includes(query.toLowerCase())
    });

    // Slice the data up to the max amount of items per page
    const visibleClassTypes = filteredClasses?.slice(pageStartIndex, pageEndIndex);

    useEffect(() => {
        async function getTest() {
            try {
                const res = await classTypesClient.getAllClassTypes(false, false);
                setClassTypes(res?.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setAlerts([
                    {
                        color: 'danger',
                        message: "We're having issues retrieving the list of classes.",
                    },
                ]);
            }
        }
        getTest();
    }, []);

    // reset the page if the filteredClasses count changes
    useEffect(() => {
        if (!loading && isMounted.current) {
            const params = new URLSearchParams(searchParams);
            params.delete('page');
            setSearchParams(params);
        } else {
            isMounted.current = true;
        }
    }, [filteredClasses.length]); // eslint-disable-line

    // actually change page when the param changes
    const searchParamsString = searchParams.toString();
    useEffect(() => {
        if (searchParams.has('page')) {
            setPage(searchParams.get('page') - 1);
        } else {
            setPage(0);
        }
    }, [searchParamsString]); // eslint-disable-line

    return (
        <div>
            <PageHeader title="Class Catalog" alerts={alerts} setAlerts={setAlerts} />
            <PageBody>
                <Container className="px-lg-5" fluid>
                    {loading && <Spinner />}
                    {loading || alerts?.length > 0 ? null : (
                        <>
                            <Search query={query} onQueryChange={(myquery) => setQuery(myquery)} />
                            <Row className="my-4">
                                {visibleClassTypes?.length > 0 ? (
                                    visibleClassTypes.map((ct) => <ClassCard key={ct.id} {...ct} />)
                                ) : (
                                    <p>
                                        There are no classes that meet your search terms. Please try
                                        again!
                                    </p>
                                )}
                            </Row>
                        </>
                    )}
                </Container>
                <div className="d-flex justify-content-end px-4 px-lg-5">
                    <CustomPagination
                        onPageChange={handlePageChange}
                        totalCount={classTypes?.length}
                        currentPage={page}
                        pageSize={itemsPerPage}
                    />
                </div>
            </PageBody>
        </div>
    );
};

export default Catalog;
