import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../theme/AppTheme';
import ColorModeSelect from '../theme/ColorModeSelect';
import { GoogleIcon, HashirIcon } from '../components/CustomIcons';
import { Link as RouterLink } from 'react-router-dom';
import { auth, googleProvider, db } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import SuccessButton from '../components/SuccessButton';
import ErrorAlert from '../components/ErrorAlert';
import { useForm } from 'react-hook-form';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '130%',
  maxWidth: 600,
  padding: theme.spacing(5),
  gap: theme.spacing(3),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  padding: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props) {
  const { disableCustomTheme } = props;
  const [firebaseError, setFirebaseError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setFirebaseError('');
    setShowError(false);
    setShowSuccess(false);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: data.name,
        createdAt: new Date(),
      });
      setSuccessMessage('Sign up successful! Please check your email to verify your account.');
      setShowSuccess(true);
    } catch (error) {
      setFirebaseError(error.message);
      setShowError(true);
    }
  };

  const handleGoogleSignIn = async () => {
    setFirebaseError('');
    setShowError(false);
    setShowSuccess(false);
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccessMessage('Sign up successful!');
      setShowSuccess(true);
    } catch (error) {
      setFirebaseError(error.message);
      setShowError(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  const handleErrorClose = () => {
    setShowError(false);
  };

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="center" alignItems="center">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <HashirIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <TextField
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ''}
                id="name"
                type="text"
                {...register('name', {
                  required: 'Please enter your name (at least 2 characters).',
                  minLength: {
                    value: 2,
                    message: 'Please enter your name (at least 2 characters).',
                  },
                })}
                placeholder="Your name"
                autoComplete="name"
                autoFocus
                fullWidth
                variant="outlined"
                color={errors.name ? 'error' : 'primary'}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'red',
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
                id="email"
                type="email"
                {...register('email', {
                  required: 'Please enter a valid email address.',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Please enter a valid email address.',
                  },
                })}
                placeholder="your@email.com"
                autoComplete="email"
                fullWidth
                variant="outlined"
                color={errors.email ? 'error' : 'primary'}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'red',
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                {...register('password', {
                  required: 'Password must be at least 6 characters long.',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long.',
                  },
                })}
                autoComplete="new-password"
                fullWidth
                variant="outlined"
                color={errors.password ? 'error' : 'primary'}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'red',
                  },
                }}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon />}
            >
              Continue with Google
            </Button>
            <Typography sx={{ textAlign: 'center', fontSize: { xs: '0.8rem', sm: '1rem' } }} className="no-account-text">
              Already have an account?{' '}
              <Link component={RouterLink} to="/signin" variant="body2" sx={{ alignSelf: 'center' }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
        {showSuccess && <SuccessButton message={successMessage} onClose={handleSuccessClose} />}
        <ErrorAlert message={firebaseError} open={showError} onClose={handleErrorClose} />
      </SignUpContainer>
    </AppTheme>
  );
}
