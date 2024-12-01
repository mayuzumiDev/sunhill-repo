import React, { useEffect, useRef } from "react";
import { Stepper, Step, Typography, Box } from "@mui/material";

const steps = [
  {
    label: "C",
    description: "Child-centered stimulating and loving environment",
    meaning:
      "Ensuring a nurturing and supportive space for children to thrive emotionally, socially, and academically, where every child feels valued and safe to express their individuality.",
    color: "#1976d2",
    // image: "/src/assets/img/home/c.png",
  },
  {
    label: "H",
    description:
      "Holistic growth of multiple intelligences with state-of-the-art technology",
    meaning:
      "Fostering intellectual, emotional, social, and physical development using cutting-edge technology, creating well-rounded individuals prepared for future challenges in various domains of life.",
    color: "#8e24aa",
    // image: "/src/assets/img/home/h.png",
  },
  {
    label: "O",
    description: "Online learning links to global cultural diversity",
    meaning:
      "Connecting students to different cultures around the world through virtual classrooms and platforms, promoting understanding, tolerance, and a global mindset that embraces diversity and inclusion.",
    color: "#43a047",
    // image: "/src/assets/img/home/o.png",
  },
  {
    label: "I",
    description: "International partnerships for improved learning",
    meaning:
      "Collaborating with global educational institutions to enhance curriculum quality, offer new perspectives, and provide students with opportunities for cross-border learning and international exposure.",
    color: "#fdd835",
    // image: "/src/assets/img/home/i.png",
  },
  {
    label: "C",
    description: "Challenges for leveling up to excellence",
    meaning:
      "Encouraging students to push their limits through carefully designed challenges that enhance critical thinking, problem-solving, and resilience, preparing them to excel in both academics and life.",
    color: "#e91e63",
    // image: "/src/assets/img/home/ch.png",
  },
  {
    label: "E",
    description: "English-speaking environment",
    meaning:
      "Providing an immersive English-speaking setting where language is not just a subject but a living, breathing tool for communication, allowing students to build proficiency and confidence in a global language.",
    color: "#1e88e5",
    // image: "/src/assets/img/home/e.png",
  },
];

const StepperComponent = () => {
  const stepRefs = useRef([]);

  useEffect(() => {
    const currentStepRefs = stepRefs.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: [0.5] }
    );

    currentStepRefs.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => {
      currentStepRefs.forEach((step) => {
        if (step) observer.unobserve(step);
      });
    };
  }, []);

  return (
    <Box
      sx={{
        mt: "12%",
        ml: { xs: "0", md: "5%" },
        textAlign: "center",
        px: { xs: 2, md: 0 },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "800",
          fontSize: { xs: "22px", md: "30px" },
          background: "linear-gradient(90deg, #1976d2, #8e24aa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: "1rem",
          letterSpacing: "0.5px",
          textShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        What Makes Us the Best Choice?
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "400",
          fontSize: { xs: "12px", md: "15px" },
          color: "#666",
          mt: "0.5rem",
          mb: "2rem",
        }}
      >
        We give our students the best...
      </Typography>

      <Stepper orientation="vertical" activeStep={-1} connector={null}>
        {steps.map((step, index) => (
          <Step
            key={step.label}
            ref={(el) => (stepRefs.current[index] = el)}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              mb: "50px",
              opacity: 0,
              transform: "translateY(50px)",
              transition: "opacity 1s ease, transform 1s ease",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: index % 2 === 0 ? "row-reverse" : "row",
                },
                alignItems: "center",
                justifyContent: "center", // Center horizontally
                gap: { xs: "20px", md: "150px" },
                mt: { xs: "20px", md: "30px" },
                mx: "auto",
                maxWidth: "90%",
              }}
            >
              {/* <Box
                component="img"
                src={step.image}
                alt={step.label}
                sx={{
                  width: { xs: "150px", md: "250px" },
                  height: { xs: "150px", md: "250px" },
                  borderRadius: "20px",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
                  },
                }}
              /> */}
              <Box sx={{ textAlign: "center", maxWidth: "400px" }}>
                <Box
                  sx={{
                    backgroundColor: step.color,
                    width: { xs: "50px", md: "70px" },
                    height: { xs: "50px", md: "70px" },
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: { xs: "1.2rem", md: "1.7rem" },
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                    mb: "14px",
                    ml: "7px",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {step.label}
                </Box>
                <Box
                  sx={{
                    textAlign: "left",
                    maxWidth: "400px",
                    ml: { xs: "0", md: "20px" },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "#444" }}
                  >
                    {step.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      color: "#777",
                      mt: "8px",
                      fontSize: { xs: "0.85rem", md: "0.95rem" },
                    }}
                  >
                    {step.meaning}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepperComponent;
