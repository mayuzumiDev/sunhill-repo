import React from 'react';
import { Container, Typography, Box, Grid, Paper, Button, TextField } from '@mui/material';
import { FaGraduationCap, FaSchool } from 'react-icons/fa';

const SpecialEd = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [studentName, setStudentName] = React.useState('');
  const [studentEmail, setStudentEmail] = React.useState('');
  const [studentAge, setStudentAge] = React.useState('');
  const [studentGradeLevel, setStudentGradeLevel] = React.useState('');
  const [studentDisability, setStudentDisability] = React.useState('');
  const [studentSchool, setStudentSchool] = React.useState('');
  const [studentAddress, setStudentAddress] = React.useState('');

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    // Save to database
    console.log('saved');
  };

  return (
    <Container maxWidth="md" className="mt-5">
      <Typography variant="h4" align="center" gutterBottom>
        Special Education Tool
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        This tool is used to collect data from students who require special education
      </Typography>
      <Box mt={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper className="p-3">
              <Typography variant="h6" gutterBottom>
                Student Information
              </Typography>
              <TextField
                label="Student Name"
                variant="outlined"
                fullWidth
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
              <TextField
                label="Student Email"
                variant="outlined"
                fullWidth
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
              />
              <TextField
                label="Student Age"
                variant="outlined"
                fullWidth
                value={studentAge}
                onChange={(e) => setStudentAge(e.target.value)}
              />
              <TextField
                label="Student Grade Level"
                variant="outlined"
                fullWidth
                value={studentGradeLevel}
                onChange={(e) => setStudentGradeLevel(e.target.value)}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className="p-3">
              <Typography variant="h6" gutterBottom>
                Student Disability
              </Typography>
              <TextField
                label="Student Disability"
                variant="outlined"
                fullWidth
                value={studentDisability}
                onChange={(e) => setStudentDisability(e.target.value)}
              />
              <Typography variant="h6" gutterBottom>
                Student School
              </Typography>
              <TextField
                label="Student School"
                variant="outlined"
                fullWidth
                value={studentSchool}
                onChange={(e) => setStudentSchool(e.target.value)}
              />
              <Typography variant="h6" gutterBottom>
                Student Address
              </Typography>
              <TextField
                label="Student Address"
                variant="outlined"
                fullWidth
                value={studentAddress}
                onChange={(e) => setStudentAddress(e.target.value)}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box mt={3} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaGraduationCap />}
          onClick={handleOpen}
        >
          Add Student
        </Button>
      </Box>
      {isOpen && (
        <SpecialEdModal
          isOpen={isOpen}
          onClose={handleClose}
          studentName={studentName}
          studentEmail={studentEmail}
          studentAge={studentAge}
          studentGradeLevel={studentGradeLevel}
          studentDisability={studentDisability}
          studentSchool={studentSchool}
          studentAddress={studentAddress}
          handleSave={handleSave}
        />
      )}
    </Container>
  );
};

const SpecialEdModal = ({
  isOpen,
  onClose,
  studentName,
  studentEmail,
  studentAge,
  studentGradeLevel,
  studentDisability,
  studentSchool,
  studentAddress,
  handleSave,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgcolor="rgba(0,0,0,0.5)"
      zIndex={10}
    >
      <Paper className="p-3">
        <Typography variant="h6" gutterBottom>
          Add Student
        </Typography>
        <TextField
          label="Student Name"
          variant="outlined"
          fullWidth
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <TextField
          label="Student Email"
          variant="outlined"
          fullWidth
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
        />
        <TextField
          label="Student Age"
          variant="outlined"
          fullWidth
          value={studentAge}
          onChange={(e) => setStudentAge(e.target.value)}
        />
        <TextField
          label="Student Grade Level"
          variant="outlined"
          fullWidth
          value={studentGradeLevel}
          onChange={(e) => setStudentGradeLevel(e.target.value)}
        />
        <TextField
          label="Student Disability"
          variant="outlined"
          fullWidth
          value={studentDisability}
          onChange={(e) => setStudentDisability(e.target.value)}
        />
        <TextField
          label="Student School"
          variant="outlined"
          fullWidth
          value={studentSchool}
          onChange={(e) => setStudentSchool(e.target.value)}
        />
        <TextField
          label="Student Address"
          variant="outlined"
          fullWidth
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaSchool />}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SpecialEd;
