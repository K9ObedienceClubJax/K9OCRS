import React from 'react';
import { Button } from 'reactstrap';
import PageHeader from '../../../shared/components/PageHeader/index';
import Profile from '../../../shared/components/Profile';

function Add() {
  return (
    <div>
      <PageHeader title='Create User'>
        <Button outline>Cancel</Button>
        <Button form='myForm'>Create User</Button>
      </PageHeader>
      <Profile mode='create' />
    </div>
  );
}

export default Add;
