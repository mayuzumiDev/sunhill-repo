import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Paper, Button, TextField, Tab, Tabs,
  CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { FaGraduationCap, FaChartLine, FaBrain, FaHistory, FaFilePdf, FaPrint } from 'react-icons/fa';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import axios from 'axios';
// import Chart from 'react-chartjs-2';

// PDF styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  section: { margin: 10, padding: 10 },
  title: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1 },
  tableRow: { flexDirection: 'row' },
  tableCell: { padding: 5, borderWidth: 1 }
});

// PDF Document Component
const AssessmentPDF = ({ assessment, results }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Special Education Assessment Report</Text>
      
      <View style={styles.section}>
        <Text style={styles.title}>Student Information</Text>
        <Text style={styles.text}>Name: {assessment.studentInfo.name}</Text>
        <Text style={styles.text}>Age: {assessment.studentInfo.age}</Text>
        <Text style={styles.text}>Assessment Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Assessment Results</Text>
        <Text style={styles.text}>Category: {assessment.category}</Text>
        <Text style={styles.text}>Confidence Score: {results.confidence_score}%</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Primary Indicators</Text>
        {results.primary_indicators.map((indicator, index) => (
          <Text key={index} style={styles.text}>• {indicator}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Recommendations</Text>
        {results.recommendations.map((rec, index) => (
          <Text key={index} style={styles.text}>• {rec}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

const SpecialEd = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [studentName, setStudentName] = React.useState('');
  const [studentEmail, setStudentEmail] = React.useState('');
  const [studentAge, setStudentAge] = React.useState('');
  const [studentGradeLevel, setStudentGradeLevel] = React.useState('');
  const [studentDisability, setStudentDisability] = React.useState('');
  const [studentSchool, setStudentSchool] = React.useState('');
  const [studentAddress, setStudentAddress] = React.useState('');
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch user role and validate access
    const checkAccess = async () => {
      try {
        const response = await axios.get('/api/user/role/');
        const role = response.data.role;
        if (!['teacher', 'admin', 'public'].includes(role)) {
          setError('You do not have permission to access this tool');
          return;
        }
        setUserRole(role);
      } catch (error) {
        setError('Error checking user permissions');
      }
    };
    checkAccess();
  }, []);

  // Function to generate chart data
  const generateChartData = (history) => {
    const labels = history.map(item => new Date(item.date).toLocaleDateString());
    const scores = history.map(item => item.confidence_score);

    return {
      labels,
      datasets: [{
        label: 'Assessment Scores',
        data: scores,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
  };

  // Filter history based on time range
  const filterHistory = (range) => {
    const now = new Date();
    let filteredHistory = [...assessmentHistory];

    switch(range) {
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filteredHistory = assessmentHistory.filter(item => 
          new Date(item.date) >= weekAgo
        );
        break;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filteredHistory = assessmentHistory.filter(item => 
          new Date(item.date) >= monthAgo
        );
        break;
      case 'year':
        const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        filteredHistory = assessmentHistory.filter(item => 
          new Date(item.date) >= yearAgo
        );
        break;
    }

    setChartData(generateChartData(filteredHistory));
  };

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

  const renderHistory = () => (
    <Paper className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h6">Assessment History</Typography>
        <FormControl size="small" style={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={selectedTimeRange}
            onChange={(e) => {
              setSelectedTimeRange(e.target.value);
              filterHistory(e.target.value);
            }}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </div>

      {chartData && (
        <div className="h-64">
          <Chart type="line" data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      )}

      <div className="space-y-4">
        {assessmentHistory.map((assessment, index) => (
          <Paper key={index} className="p-4 border hover:shadow-md transition-shadow">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" className="font-semibold">
                  {assessment.student_name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(assessment.date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2">
                  Category: {assessment.category}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Score: {assessment.confidence_score}%
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} className="flex justify-end space-x-2">
                <PDFDownloadLink
                  document={<AssessmentPDF assessment={assessment} results={assessment.results} />}
                  fileName={`assessment-${assessment.student_name}-${new Date(assessment.date).toLocaleDateString()}.pdf`}
                >
                  {({ blob, url, loading, error }) => (
                    <Button
                      variant="outlined"
                      startIcon={<FaFilePdf />}
                      disabled={loading}
                    >
                      Download PDF
                    </Button>
                  )}
                </PDFDownloadLink>
                <Button
                  variant="outlined"
                  startIcon={<FaPrint />}
                  onClick={() => window.print()}
                >
                  Print
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </div>
    </Paper>
  );

  if (error) {
    return (
      <Container maxWidth="md" className="mt-8">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" className="text-center mb-2">
        Special Education Assessment Tool
      </Typography>
      <Typography variant="body1" color="textSecondary" className="text-center mb-6">
        Professional assessment tool for educators and administrators
      </Typography>

      {successMessage && (
        <Alert severity="success" className="mb-4" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

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
      {renderHistory()}
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
