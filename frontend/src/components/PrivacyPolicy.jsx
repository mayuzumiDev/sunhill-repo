import React from 'react';
import { Typography, Container, Box, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Security, Visibility, Lock, Gavel, Update } from '@mui/icons-material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, marginBottom: 4 }}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          At Sunhill Montessori Casa, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data. We encourage you to read this policy carefully to understand our practices regarding your personal information.
        </Typography>

        <Typography variant="h5" gutterBottom>
          1. Information We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We collect various types of information to provide and improve our services:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Visibility />
            </ListItemIcon>
            <ListItemText primary="Personal Information: Name, email address, phone number, and other contact details you provide." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Lock />
            </ListItemIcon>
            <ListItemText primary="Account Information: Login credentials and preferences related to your account." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Update />
            </ListItemIcon>
            <ListItemText primary="Usage Data: Information on how you interact with our website and services." />
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          2. How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph>
          We use the collected information for various purposes, including:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Providing and maintaining our services" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Improving and personalizing user experience" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Communicating with you about updates, offers, and important notices" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Analyzing usage patterns to enhance our website and services" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Complying with legal obligations" />
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          3. Data Security
        </Typography>
        <Typography variant="body1" paragraph>
          We implement robust security measures to protect your personal information:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Security />
            </ListItemIcon>
            <ListItemText primary="Encryption: We use industry-standard encryption to protect data transmission and storage." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Lock />
            </ListItemIcon>
            <ListItemText primary="Access Controls: We limit access to personal information to authorized personnel only." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Update />
            </ListItemIcon>
            <ListItemText primary="Regular Audits: We conduct periodic security audits to ensure the effectiveness of our measures." />
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          4. Your Rights
        </Typography>
        <Typography variant="body1" paragraph>
          You have several rights regarding your personal information:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Visibility />
            </ListItemIcon>
            <ListItemText primary="Access: You can request access to your personal information." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Update />
            </ListItemIcon>
            <ListItemText primary="Correction: You can ask us to correct any inaccurate or incomplete information." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Lock />
            </ListItemIcon>
            <ListItemText primary="Deletion: You can request the deletion of your personal information under certain circumstances." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Gavel />
            </ListItemIcon>
            <ListItemText primary="Objection: You can object to the processing of your personal information in certain situations." />
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom>
          5. Changes to This Policy
        </Typography>
        <Typography variant="body1" paragraph>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </Typography>

        <Typography variant="h5" gutterBottom>
          6. Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions or concerns about our Privacy Policy or data practices, please contact us at smcbatangascity@sunhilledu.com.
        </Typography>

        <Box mt={3}>
          <Typography variant="body2" color="textSecondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;

