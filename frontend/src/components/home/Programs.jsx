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
      "This is a more detailed description about the Lego Education Robotics program, including its benefits, teaching methods, and impact on students.",
    image: "/src/assets/img/home/lego.jpg",
    title: "Hands-On Robotics Learning", // Custom title
  },
  {
    level: "English Computerized Learning Program (ECLP)",
    description:
      "Pronunciation Power is an easy and effective way to learn the 52 sounds of the English Language...",
    fullDescription:
      "This program focuses on enhancing pronunciation and comprehension through an interactive computerized learning system.",
    image: "/src/assets/img/home/eclp.png",
    title: "Interactive English Learning", // Custom title
  },
  {
    level: "Reading Comprehension Program",
    description:
      "It is a Reading program designed to encourage a healthy reading habit among Sunhillian...",
    fullDescription:
      "This program enhances reading skills through interactive exercises and regular reading sessions.",
    image: "/src/assets/img/home/rcp.jpg",
    title: "Enhanced Reading Skills", // Custom title
  },
  {
    level: "Faithbook",
    description:
      "It is an online Catechetical learning tool that aims to increase one's faith and build character...",
    fullDescription:
      "Faithbook serves as a helpful resource for students, together with their parents and teachers, connect with online Faith Friends to help each other grow in their Faith. The portal is safe, secure and free from the usual distractions and temptations found in the other social networking sites. Video and image links are opened and loaded within the site, enabling the user to focus on the catechetical instruction. It automatically screens entries, blocking foul words, obscene images and materials. Faithbook helps users stay focused on spiritual growth, emotional and moral development",
    image: "/src/assets/img/home/fb.jpg",
    title: "Online Catechetical Learning Tool", // Custom title
  },
  {
    level: "Abacus Mental Math",
    description:
      "It is a program that supports the child's ability to perform simple mathematical operations with ease...",
    fullDescription:
      "This mental math program is designed to boost children's numerical abilities through the use of the abacus.",
    image: "/src/assets/img/home/mental.jpg",
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
                    }}
                  >
                    <img
                      src={program.image}
                      alt={program.level}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "16px",
                      }}
                    />
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
          <img
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
          />
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
