import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Fade, Slide } from "react-awesome-reveal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import CloseIcon from "@mui/icons-material/Close";

const programs = [
  {
    level: "Lego Education Robotics",
    description:
      "It is a body of teaching and learning practice based on LEGO Robotics kits, popular sets of materials that enable individuals...",
    fullDescription:
      "Lego Education Robotics is an engaging program that introduces students to the exciting world of robotics using the popular Lego Robotics kits. Through hands-on learning, students are able to build and program robots, fostering creativity and critical thinking. This program not only enhances students' understanding of STEM (Science, Technology, Engineering, and Mathematics) but also encourages teamwork, problem-solving, and innovation. Each session is designed to help students grasp complex concepts through interactive and playful activities. The use of Lego Robotics makes abstract ideas more tangible, making it easier for students to understand mechanical and programming concepts. In the long run, students develop technical skills while nurturing their curiosity and enthusiasm for technology. With the ever-increasing demand for technical expertise in various fields, this program offers a solid foundation for students to excel in future endeavors.",
    // image: "/src/assets/img/home/lego.jpg",
    title: "Hands-On Robotics Learning", // Custom title
  },
  {
    level: "English Computerized Learning Program (ECLP)",
    description:
      "Pronunciation Power is an easy and effective way to learn the 52 sounds of the English Language...",
    fullDescription:
      "The English Computerized Learning Program (ECLP) is an advanced system designed to improve pronunciation, comprehension, and overall communication skills in the English language. The program uses cutting-edge software, such as Pronunciation Power, to break down the 52 sounds of the English language, making learning easy and effective. Students can engage in interactive exercises that focus on listening, speaking, and pronunciation, while visual aids reinforce correct speech patterns. The program is particularly beneficial for non-native speakers, as it offers personalized learning paths to address individual language needs. Over time, students gain confidence in speaking and understanding English, improving both academic and social communication skills. ECLP's unique computerized approach allows learners to progress at their own pace, ensuring mastery of the English language in an interactive and enjoyable way.",
    // image: "/src/assets/img/home/eclp.png",
    title: "Interactive English Learning", // Custom title
  },
  {
    level: "Reading Comprehension Program",
    description:
      "It is a Reading program designed to encourage a healthy reading habit among Sunhillian...",
    fullDescription:
      "The Reading Comprehension Program is designed to foster a lifelong love for reading among students at Sunhill Montessori Casa. The program aims to enhance reading skills through a variety of methods, including interactive exercises, guided reading sessions, and regular assessments. Students are encouraged to read diverse genres of literature, helping them build a strong vocabulary, improve comprehension, and develop critical thinking skills. The program promotes a positive reading culture by integrating group activities, book discussions, and individualized reading plans. As students progress, they become more proficient in understanding complex texts, which in turn supports their academic growth across all subjects. Through personalized attention and a structured curriculum, the Reading Comprehension Program ensures that every student can enjoy reading and see its value both inside and outside the classroom.",
    // image: "/src/assets/img/home/rcp.jpg",
    title: "Enhanced Reading Skills", // Custom title
  },
  {
    level: "Faithbook",
    description:
      "It is an online Catechetical learning tool that aims to increase one's faith and build character...",
    fullDescription:
      "Faithbook serves as a helpful resource for students, together with their parents and teachers, connect with online Faith Friends to help each other grow in their Faith. The portal is safe, secure and free from the usual distractions and temptations found in the other social networking sites. Video and image links are opened and loaded within the site, enabling the user to focus on the catechetical instruction. It automatically screens entries, blocking foul words, obscene images and materials. Faithbook helps users stay focused on spiritual growth, emotional and moral development",
    // image: "/src/assets/img/home/fb.jpg",
    title: "Online Catechetical Learning Tool", // Custom title
  },
  {
    level: "Abacus Mental Math",
    description:
      "It is a program that supports the child's ability to perform simple mathematical operations with ease...",
    fullDescription:
      "The Abacus Mental Math program is a specialized training designed to strengthen children’s numerical abilities by using the traditional abacus. This program goes beyond simple arithmetic, helping students visualize numbers and perform calculations mentally with speed and accuracy. It enhances cognitive functions such as memory, concentration, and logical reasoning. With consistent practice, students can perform complex calculations mentally without relying on calculators or paper. The abacus technique taps into both the left and right hemispheres of the brain, fostering a holistic approach to learning math. Over time, children develop a deep understanding of numbers, which not only boosts their mathematical abilities but also positively impacts their performance in other academic areas. The program is structured in a fun and engaging way, making math enjoyable for all learners, and lays a strong foundation for future success in mathematics.",
    // image: "/src/assets/img/home/mental.jpg",
    title: "Abacus-Based Math Training", // Custom title
  },
];

const ProgramsSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark"; // Check if it's dark mode
  const [open, setOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleOpen = (program) => {
    setSelectedProgram(program);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProgram(null);
  };

  return (
    <Box
      className="programsec"
      component="section"
      sx={{
        py: 8,
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5", // Adjust the background for dark mode
        color: isDarkMode ? "#fff" : "#333",
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Fade triggerOnce={true}>
          <Typography
            variant="h4"
            className="progTitle"
            component="h2"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: "bold",
              textShadow: isDarkMode
                ? "1px 1px 2px rgba(255, 255, 255, 0.2)"
                : "1px 1px 2px rgba(0, 0, 0, 0.2)",
              mb: 6,
              color: isDarkMode ? "#fff" : "#333",
            }}
          >
            Programs
          </Typography>

          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            navigation
            pagination={{
              clickable: true,
              renderBullet: (index, className) =>
                `<span class="${className}" style="background: ${
                  isDarkMode ? "#ff7043" : "#333"
                }; width: 10px; height: 10px; border-radius: 50%; margin: 0 1px;"></span>`,
            }}
            autoplay={{ delay: 3000 }}
            modules={[Navigation, Pagination, Autoplay]}
            style={{
              paddingBottom: "50px",
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {programs.map((program, index) => (
              <SwiperSlide key={index}>
                <Slide direction="up" triggerOnce={true} delay={100 * index}>
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: isDarkMode ? "#444" : "#e0e0e0",
                      borderRadius: 2,
                      boxShadow: isDarkMode
                        ? "0 4px 12px rgba(255, 255, 255, 0.1)"
                        : "0 4px 12px rgba(0, 0, 0, 0.1)",
                      padding: 3,
                      backgroundColor: isDarkMode ? "#333" : "#fff",
                      textAlign: "center",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)", // Add hover effect
                      },
                    }}
                  >
                    {/* Unique SVG for each program */}
                    {program.level === "Lego Education Robotics" && (
                      <svg
                        width="100%"
                        height="auto"
                        viewBox="0 0 100 100"
                        style={{ marginBottom: "16px" }}
                      >
                        <rect width="100" height="100" fill="#ffcc00" />
                        <polygon points="50,15 90,85 10,85" fill="#ff7043" />
                      </svg>
                    )}
                    {program.level === "English Computerized Learning Program (ECLP)" && (
                      <svg
                        width="100%"
                        height="auto"
                        viewBox="0 0 100 100"
                        style={{ marginBottom: "16px" }}
                      >
                        <circle cx="50" cy="50" r="40" fill="#4caf50" />
                        {/* <text x="50%" y="50%" textAnchor="middle" fill="#fff" fontSize="20">
                          ECLP
                        </text> */}
                      </svg>
                    )}
                    {program.level === "Reading Comprehension Program" && (
                      <svg
                        width="100%"
                        height="auto"
                        viewBox="0 0 100 100"
                        style={{ marginBottom: "16px" }}
                      >
                        <path d="M10 10 H 90 V 90 H 10 Z" fill="#2196f3" />
                        {/* <text x="50%" y="50%" textAnchor="middle" fill="#fff" fontSize="20">
                          Read
                        </text> */}
                      </svg>
                    )}
                    {program.level === "Faithbook" && (
                      <svg
                        width="100%"
                        height="auto"
                        viewBox="0 0 100 100"
                        style={{ marginBottom: "16px" }}
                      >
                        <ellipse cx="50" cy="50" rx="40" ry="20" fill="#9c27b0" />
                        {/* <text x="50%" y="50%" textAnchor="middle" fill="#fff" fontSize="20">
                          Faith
                        </text> */}
                      </svg>
                    )}
                    {program.level === "Abacus Mental Math" && (
                      <svg
                        width="100%"
                        height="auto"
                        viewBox="0 0 100 100"
                        style={{ marginBottom: "16px" }}
                      >
                        <line x1="10" y1="50" x2="90" y2="50" stroke="#ff9800" strokeWidth="10" />
                        <circle cx="20" cy="50" r="5" fill="#ff5722" />
                        <circle cx="80" cy="50" r="5" fill="#ff5722" />
                      </svg>
                    )}
                    <Typography variant="h5" component="h3" gutterBottom>
                      {program.level}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {program.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        marginTop: 2,
                        backgroundColor: isDarkMode ? "#ff7043" : "#333",
                        color: isDarkMode ? "#333" : "#fff",
                        "&:hover": {
                          backgroundColor: isDarkMode ? "#ffab91" : "#555",
                        },
                      }}
                      onClick={() => handleOpen(program)}
                    >
                      View Programs
                    </Button>
                  </Box>
                </Slide>
              </SwiperSlide>
            ))}
          </Swiper>
        </Fade>
      </Container>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: isDarkMode ? "#333" : "#f5f5f5",
            color: isDarkMode ? "#fff" : "#000",
          }}
        >
          {selectedProgram?.level}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            backgroundColor: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
          }}
        >
          {/* <img
            src={selectedProgram?.image}
            alt={selectedProgram?.level}
            style={{
              width: "100%",
              maxWidth: "200px",
              height: "auto",
              borderRadius: "8px",
              marginBottom: "16px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          /> */}
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            {selectedProgram?.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {selectedProgram?.fullDescription.split(". ")[0] + "."}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {selectedProgram?.fullDescription.split(". ").slice(1).join(". ") +
              "."}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProgramsSection;
