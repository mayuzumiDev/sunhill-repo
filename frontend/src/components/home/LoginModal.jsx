import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, TextField, Typography, Divider, IconButton, Box, Modal, CircularProgress, useTheme } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginModal = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState('');  
  const [loading, setLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        const tokens = await axios.post('http://localhost:3001/auth/google', {
          code: codeResponse.code,
        });
        console.log('Tokens:', tokens);
        
        // Save user data (or tokens) if needed
        sessionStorage.setItem('user', JSON.stringify(tokens.data));

        // Redirect to the dashboard
        navigate("/login/");
      } catch (error) {
        console.error('Error during Google login:', error);
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Login Failed:', errorResponse);
      setLoading(false);
    },
  });

  const handleSignIn = (event) => {
    event.preventDefault();
    // Handle sign-in logic
    console.log('Sign In with', email, password);
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    // Handle sign-up logic
    console.log('Sign Up with', firstName, lastName, email, password);
  };

  return (
    <Modal
      open={isVisible}
      onClose={onClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
          backdropFilter: 'blur(1px)',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
        }}
      >
        <Box
  sx={{
    width: '100%', // Adjust the width for different screen sizes
    maxWidth: { xs: 300, sm: 375}, 
    padding: 4,
    borderRadius: 3,
    background: theme.palette.mode === 'dark' ? '#333' : '#fff',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)',
    textAlign: 'center',
    position: 'relative',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  }}
>

          <IconButton
            sx={{ position: 'absolute', top: 16, right: 16, color: theme.palette.text.primary }}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>
            {hasAccount ? 'Login' : 'Sign Up'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: theme.palette.text.secondary }}>
            {hasAccount 
              ? 'Please sign in to use the advanced features of our tool and get the most out of your experience.'
              : 'Create an account to get started and enjoy our advanced features.'}
          </Typography>
          <form onSubmit={hasAccount ? handleSignIn : handleSignUp}>
            {!hasAccount && (
              <>
                <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    sx={{
                      width: '50%',
                      borderRadius: 12,
                      bgcolor: theme.palette.background.paper,
                      '& fieldset': {
                        border: `1px solid ${theme.palette.text.disabled}`,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  />
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    sx={{
                      width: '50%',
                      borderRadius: 12,
                      bgcolor: theme.palette.background.paper,
                      '& fieldset': {
                        border: `1px solid ${theme.palette.text.disabled}`,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  />
                </Box>
              </>
            )}
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  borderRadius: 12,
                  bgcolor: theme.palette.background.paper,
                  '& fieldset': {
                    border: `1px solid ${theme.palette.text.disabled}`,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  borderRadius: 12,
                  bgcolor: theme.palette.background.paper,
                  '& fieldset': {
                    border: `1px solid ${theme.palette.text.disabled}`,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: 20,
                mb: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #6D28D9 30%, #8B5CF6 90%)',
                color: 'white',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : hasAccount ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
       
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Typography
    variant="body2"o
    sx={{ color: theme.palette.text.secondary}}
  >
    {hasAccount ? "Don't have an account?" : "Already have an account?"}
  </Typography>

  <Typography
    variant="body2"
    sx={{ color: theme.palette.primary.main, cursor: 'pointer', fontWeight: 'bold', ml: 1 }} // Highlighted link
    onClick={() => setHasAccount(!hasAccount)}
  >
    {hasAccount ? 'Sign up' : 'Login'}
  </Typography>
</Box>


          <Divider sx={{ my: 3, color: theme.palette.text.secondary }}>or</Divider>
          <Button
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 20,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#4285F4',
              color: 'white',
              '&:hover': {
                backgroundColor: '#357ae8',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => googleLogin()}
          >
          <GoogleIcon sx={{ mr: 1 }} />
            Login with Google
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoginModal;