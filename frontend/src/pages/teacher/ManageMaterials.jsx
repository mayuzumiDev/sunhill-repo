import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import ClassroomCard from "../../components/teacher/materials/ClassroomCard";
import MaterialCard from "../../components/teacher/materials/MaterialCard";
import DotLoaderSpinner from "../../components/loaders/DotLoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const ManageMaterials = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [classrooms, setClassrooms] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  useEffect(() => {
    fetchClassroom();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      fetchMaterials(selectedClassroom.id);
    }
  }, [selectedClassroom]);

  const fetchClassroom = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get("/user-teacher/classroom/list/");

      if (response.status === 200) {
        const classroomList = response.data.classroom_list;
        console.log("Classroom List", classroomList);
        setClassrooms(classroomList);
      }
    } catch (error) {
      console.error("An error occured fetching the classroom list.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaterials = async (classroomId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        "/user-teacher/materials/list/",
        {
          params: {
            classroom: classroomId,
          },
        }
      );

      if (response.status === 200) {
        const materialList = response.data.materials_list;
        console.log("Material list", materialList);
        setMaterials(materialList);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {!selectedClassroom ? (
        <>
          <h1 className="text-2xl font-bold mb-12">
            Manage Learning Materials
          </h1>

          {/* Grid List for classroom */}
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <DotLoaderSpinner color="#4ade80" />
            </div>
          ) : classrooms.length === 0 ? (
            <p className="text-gray-600">
              No classroom available. Please create a classroom.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((classroom, index) => (
                <ClassroomCard
                  key={classroom.id || index}
                  classroomData={classroom}
                  onSelect={() => setSelectedClassroom(classroom)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        // Selected classroom view
        <div>
          <div className="flex items-center mb-8">
            <button
              onClick={() => setSelectedClassroom(null)}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold">
              {selectedClassroom.grade_level} -{" "}
              {selectedClassroom.class_section}
            </h1>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600">
                  Subject:{" "}
                  <span className="font-semibold">
                    {selectedClassroom.subject_name_display}
                  </span>
                </p>
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-bold">
                Upload Material
              </button>
            </div>

            {/* Add your material management content here */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Materials</h2>
              {/* Materials Grid List */}
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <DotLoaderSpinner color="#4ade80" />
                </div>
              ) : materials.length === 0 ? (
                <p className="text-gray-600 text-center">
                  No materials uploaded yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materials.map((material) => (
                    <MaterialCard key={material.id} material={material} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMaterials;
