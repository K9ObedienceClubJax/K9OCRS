import React, { useState } from 'react';
import axios from 'axios';
import { Input, Form, Button } from 'reactstrap';

const handleSubmit = async (e, files) => {
  e.preventDefault();
  console.log(files);
  var formData = new FormData();

  // This is how you would upload multiple files
  // for(let i = 0; i < files.length; i++) {
  //   formData.append('files', files[i], files[i].name);
  // }

  formData.append('file', files[0]);

  console.log(formData);

  const result = await axios.post('/api/classtypes/testImageUpload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  console.log(result);
};

export default function TestUpload() {
  const [test, setTest] = useState([]);

  return (
    <div>
      <Form onSubmit={e => handleSubmit(e, test)}>
        <Input
          name="files"
          type="file"
          className="form-control"
          onChange={e => setTest(e.target?.files)}
          multiple
          accept="image/png"
        />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  )
}
