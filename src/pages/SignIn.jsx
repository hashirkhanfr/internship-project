import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from '../components/ForgotPassword';
import AppTheme from '../theme/AppTheme';
import ColorModeSelect from '../theme/ColorModeSelect';
import { GoogleIcon, HashirIcon } from '../components/CustomIcons';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import SuccessButton from '../components/SuccessButton';
import ErrorAlert from '../components/ErrorAlert';
import { useForm } from 'react-hook-form';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '150%',
  maxWidth: 600,
  minHeight: 480,
  padding: theme.spacing(5),
  gap: theme.spacing(3),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '130%',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn(props) {
  const { disableCustomTheme } = props;
  const [firebaseError, setFirebaseError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [emailForReset, setEmailForReset] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setFirebaseError('');
    setShowError(false);
    setShowSuccess(false);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          name: '',
          lastLogin: new Date(),
        });
      } else {
        await setDoc(userDocRef, { lastLogin: new Date() }, { merge: true });
      }
      if (user.emailVerified) {
        setSuccessMessage('Sign in successful!');
        setShowSuccess(true);
        const role = userDocSnap.data().role;
        if (role === 'admin') {
          window.location.href = import.meta.env.BASE_URL + 'admin';
        } else {
          window.location.href = import.meta.env.BASE_URL + 'dashboard';
        }
      } else {
        setFirebaseError('Please verify your email before accessing the dashboard.');
        setShowError(true);
      }
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
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          lastLogin: new Date(),
        });
      } else {
        await setDoc(userDocRef, { lastLogin: new Date() }, { merge: true });
      }
      setSuccessMessage('Sign in successful!');
      setShowSuccess(true);
      const role = userDocSnap.exists() ? userDocSnap.data().role : null;
      if (role === 'admin') {
        window.location.href = import.meta.env.BASE_URL + 'admin';
      } else {
        window.location.href = import.meta.env.BASE_URL + 'dashboard';
      }
    } catch (error) {
      setFirebaseError(error.message);
      setShowError(true);
    }
  };

  const handleClickOpen = () => {
    const currentEmail = getValues('email') || '';
    setEmailForReset(currentEmail);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      <SignInContainer direction="column" justifyContent="center" alignItems="center">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <HashirIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
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
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : '\u00A0'}
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
                autoFocus
                fullWidth
                variant="outlined"
                color={errors.email ? 'error' : 'primary'}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'red',
                  },
                  '& .MuiFormHelperText-root': {
                    minHeight: '1.5em',
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : '\u00A0'}
                id="password"
                type="password"
                {...register('password', {
                  required: 'Password must be at least 6 characters long.',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long.',
                  },
                })}
                placeholder="••••••"
                autoComplete="current-password"
                fullWidth
                variant="outlined"
                color={errors.password ? 'error' : 'primary'}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'red',
                  },
                  '& .MuiFormHelperText-root': {
                    minHeight: '1.5em',
                  },
                }}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
              className="remember-me-label"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button type="submit" fullWidth variant="contained">
              Sign in
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center', fontSize: { xs: '0.8rem', sm: '1rem' } }}
              className="forgot-password-link"
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Typography sx={{ textAlign: 'center', fontSize: { xs: '0.8rem', sm: '1rem' } }} className="no-account-text">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/signup" variant="body2" sx={{ alignSelf: 'center' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
        {showSuccess && <SuccessButton message={successMessage} onClose={handleSuccessClose} />}
        <ErrorAlert message={firebaseError} open={showError} onClose={handleErrorClose} />
      </SignInContainer>
    </AppTheme>
  );
}
