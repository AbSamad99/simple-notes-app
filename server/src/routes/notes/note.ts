import { Router } from "express";
import { createNoteRouter } from "./create-note";
import { deleteNoteRouter } from "./delete-note";
import { getAllNotesRouter } from "./get-all-notes";
import { getNoteRouter } from "./get-note";
import { updateNoteRouter } from "./update-note";

const router = Router();

router.use(createNoteRouter);
router.use(updateNoteRouter);
router.use(getAllNotesRouter);
router.use(getNoteRouter);
router.use(deleteNoteRouter);

export { router as noteRouter };
