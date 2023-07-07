import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import axios from 'axios';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Page from '../components/Page';
// sections
import { FormProvider, RHFTextField } from '../components/hook-form';

import LoginLayout from '../layouts/LoginLayout';

// ----------------------------------------------------------------------

export default function ForgotPassword() {
  // const navigate = useNavigate();
  const [email, setEmail]= useState('');

  const [openAlert, setOpenAlert] = useState(false);
  const [openAlert500, setOpenAlert500] = useState(false);

  const defaultValues = {
    email: '',
    remember: true,
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = () => {
    const data = {
      email
    }
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/forgotpassword`, data)
      .then(res => {
        if (res.status === 200) {
          setOpenAlert(true)
        }
      }).catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setOpenAlert500(true)
        } else if (error.request) {
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
    
  };

  return (
    <Page title="Forgot Password">
      <LoginLayout>
        <Typography align="center" variant="h4" gutterBottom>
          Forgot Password
        </Typography>

        <Typography align="center" sx={{ color: 'text.secondary', mb: 5 }}>Enter your email below.</Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Collapse in={openAlert}>
            <Alert
              sx={{ mb: 2 }}
            >
              We've sent the link, Check your Email!
            </Alert>
          </Collapse>
          <Collapse in={openAlert500}>
            <Alert
              severity='error'
              sx={{ mb: 2 }}
            >
              Uih, this email is not registered.
            </Alert>
          </Collapse>
          <Stack spacing={3} sx={{mb:2}} >
            <RHFTextField name="email" label="Email address" value={email} onChange={(e) => {setEmail(e.target.value)}} />
          </Stack>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} color="warning">
            Send Email
          </LoadingButton>
        </FormProvider>
      </LoginLayout>
    </Page>
  );
}
