import { BlendChangeLogByIdResponse } from "@/interfaces/blendSheet";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export interface BlendingSheetChangeLogPopupProps {
  open: boolean;
  onClose: () => void;
  dialogTitle: string;
  logData: BlendChangeLogByIdResponse | null;
  logDataIsLoading: boolean;
}

export default function BlendingSheetChangeLogPopup(
  props: BlendingSheetChangeLogPopupProps
) {
  const { 
    open, 
    onClose, 
    dialogTitle, 
    logData, 
    logDataIsLoading 
  } = props;


  //  Merge all sections with same name but retain original chunk boundaries
  const mergedSections = React.useMemo(() => {
    if (!logData?.sections) return [];

    const map = new Map<string, { allFields: any[]; groups: number[] }>();

    logData.sections.forEach((section) => {
      const name = section.sectionName.trim();

      if (!map.has(name)) {
        // First time seeing this section name
        map.set(name, {
          allFields: [...section.fields],
          groups: [section.fields.length], // to track first group size
        });
      } else {
        // Merge into existing section group
        const entry = map.get(name)!;
        entry.allFields.push(...section.fields);
        entry.groups.push(section.fields.length); // to track next group size
      }
    });

    return Array.from(map.entries()).map(([sectionName, data]) => ({
      sectionName,
      allFields: data.allFields,
      groups: data.groups, // original section chunk sizes
    }));
  }, [logData]);

  // Background colors for each inner group
  const groupColors = ["#ffffff", "#f3f7ff"];

  return (
    <Dialog
      open={open}
      id="changeLogDialog"
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle id="alert-dialog-title" sx={{fontSize:'1rem'}}>
        <h3>{dialogTitle}</h3>
        <IconButton
          sx={{ position: "absolute", right: 8, top: 8 }}
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Loading state */}
      {logDataIsLoading && (
        <DialogContent>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={50} />
          </Box>
        </DialogContent>
      )}

      {/*  Render merged + grouped sections */}
      {logData && !logDataIsLoading && (
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Changed Field</TableCell>
                  <TableCell>Previous Value</TableCell>
                  <TableCell>New Value</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {mergedSections.map((section, sectionIndex) => {
                  let groupStart = 0;

                  return (
                    <React.Fragment key={sectionIndex}>
                      {/* Section header */}
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          sx={{ fontSize: 15, fontWeight: 900 }}
                        >
                          {section.sectionName} Details
                        </TableCell>
                      </TableRow>

                      {/*  Show message when section has NO data */}
                      {section.allFields.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            sx={{
                              paddingLeft: 2,
                              paddingTop: 1,
                              paddingBottom: 1,
                              fontStyle: "italic",
                              color: "#777",
                            }}
                          >
                            No {section.sectionName.toLowerCase()} change logs
                            available.
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Render ONLY IF section has fields */}
                      {section.allFields.length > 0 &&
                        section.groups.map((groupSize, groupIndex) => {
                          const bgColor =
                            groupColors[groupIndex % groupColors.length];

                          const rows = section.allFields.slice(
                            groupStart,
                            groupStart + groupSize
                          );

                          const previousTotal = mergedSections
                            .slice(0, sectionIndex)
                            .reduce((acc, s) => acc + s.allFields.length, 0);

                          const rowStartNumber = previousTotal + groupStart + 1;

                          groupStart += groupSize;

                          return (
                            <React.Fragment key={groupIndex}>
                              {rows.map((field, fieldIndex) => (
                                <TableRow
                                  key={fieldIndex}
                                  sx={{ backgroundColor: bgColor }}
                                >
                                  <TableCell>
                                    {rowStartNumber + fieldIndex}
                                  </TableCell>
                                  <TableCell>{field.fieldName}</TableCell>
                                  <TableCell>
                                    {field.previousValue ?? "-"}
                                  </TableCell>
                                  <TableCell>
                                    {field.currentValue ?? "-"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </React.Fragment>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      )}
    </Dialog>
  );
}
