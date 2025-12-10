// MyDocument.js
import React, { useEffect } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Tooltip } from "react-bootstrap";
import { CenterFocusStrong } from "@mui/icons-material";

const styles = StyleSheet.create({
  page: {
    width: "100%",
    padding: 10,
    backgroundColor: "#020202",
    display: "flex",
    flexDirection: "column",
    // height: "500vh",
    justifyContent: "space-evenly",
  },
  weekName: {},
  dayName: { fontSize: 30, textAlign: "center", color: "#ffffff" },
  dayPage: {},

  section: {
    // padding: 20,
    width: "100%",
    backgroundColor: "#a6ce24",
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
  sectionName: { fontSize: 40, marginBottom: 20, color: "#ffffff" },
  exerciseSection: {
    width: "100%",
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
  },
  exerciseTop: { marginBottom: 15 },
  exerciseMiddle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  exerciseBottom: {},
  exerciseText: { fontSize: 10 },
  exerciseName: {},
});

const DocumentPDF = ({ week }: { week: any }) => {
  if (!week) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Documenti non disponibili.</Text>
        </Page>
      </Document>
    );
  }
  return (
    <Document>
      <Page size="A4" style={[styles.page]}>
        <View style={styles.page}>
          <Text style={styles.weekName}>{week.name}</Text>
          {week.days &&
            week.days.map((day: any, dayIndex: number) => (
              <View style={styles.dayPage}>
                <Text style={styles.dayName}>{day.name}</Text>

                {day.sections &&
                  day.sections.map((section: any, indexSection: number) => {
                    return (
                      <View style={styles.section}>
                        <Text style={styles.sectionName}>
                          {section.exercises ? section.name : null}
                        </Text>
                        {section.exercises &&
                          section.exercises.map(
                            (exercise: any, exIndex: number) =>
                              exercise.exe ? (
                                <View style={styles.exerciseSection}>
                                  <View style={styles.exerciseTop}>
                                    <Text style={styles.exerciseName}>
                                      {"🔵 " + exercise.exe.name}
                                    </Text>
                                  </View>
                                  <View style={styles.exerciseMiddle}>
                                    <Text style={styles.exerciseText}>
                                      Sets {"\n" + exercise.series}
                                    </Text>
                                    <Text style={styles.exerciseText}>
                                      Ripetizioni {"\n" + exercise.repetitions}
                                    </Text>
                                    <Text style={styles.exerciseText}>
                                      Riposo{" "}
                                      {"\n" + Math.floor(exercise.stop / 60)}m
                                      {exercise.stop % 60}s
                                    </Text>
                                    <Text style={styles.exerciseText}>
                                      Carico {"\n" + exercise.load} kg
                                    </Text>

                                    <Text style={styles.exerciseText}>
                                      Intensità {"\n" + exercise.intensity}
                                    </Text>
                                  </View>
                                  {exercise.description !== "" && (
                                    <View style={styles.exerciseBottom}>
                                      <Text style={styles.exerciseText}>
                                        Descrizione{" "}
                                        {"\n" + exercise.description}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              ) : (
                                <div className="col-12 no-pm" key={exIndex}>
                                  {exercise.super_series &&
                                    exercise.super_series.map(
                                      (supSer: any, supSerIndex: number) => (
                                        <View style={styles.exerciseSection}>
                                          <View style={styles.exerciseTop}>
                                            <Text style={styles.exerciseName}>
                                              {"🔵 " + supSer.exe.name}
                                            </Text>
                                          </View>
                                          <View style={styles.exerciseMiddle}>
                                            <Text style={styles.exerciseText}>
                                              Sets {"\n" + supSer.series}
                                            </Text>
                                            <Text style={styles.exerciseText}>
                                              Ripetizioni{" "}
                                              {"\n" + supSer.repetitions}
                                            </Text>
                                            <Text style={styles.exerciseText}>
                                              Riposo
                                              {"\n" +
                                                Math.floor(supSer.stop / 60)}
                                              m{supSer.stop % 60}s
                                            </Text>
                                            <Text style={styles.exerciseText}>
                                              Carico {"\n" + supSer.load} kg
                                            </Text>

                                            <Text style={styles.exerciseText}>
                                              Intensità{" "}
                                              {"\n" + supSer.intensity}
                                            </Text>
                                          </View>
                                          {supSer.description !== "" && (
                                            <View style={styles.exerciseBottom}>
                                              <Text style={styles.exerciseText}>
                                                Descrizione{" "}
                                                {"\n" + supSer.description}
                                              </Text>
                                            </View>
                                          )}
                                        </View>
                                      )
                                    )}
                                  {section.exercises.length - 1 !== exIndex && (
                                    <div className="col-12 m-auto p-0 mt-2 mb-2">
                                      <hr className="col-12 no-pm" />
                                    </div>
                                  )}
                                </div>
                              )
                          )}
                      </View>
                    );
                  })}
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
};

export default DocumentPDF;
