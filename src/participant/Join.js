import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

function Join(props) {
	const [redirect, setRedirect] = useState(null);

	const { eventId } = useParams();

	useEffect(() => {
		fetch(`/events/${eventId}/join`, {
			method: "POST",
		})
			.then((res) => {
				if (res.ok) {
					setRedirect(`/p/event/${eventId}`);
				} else {
					throw new Error("Failed to join");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, [eventId]);

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	return (
		<React.Fragment>
			<Box
				sx={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Stack
					spacing={2}
					direction="row"
					sx={{ alignItems: "center" }}
				>
					<CircularProgress size={24} />
					<Typography>Bitte warten...</Typography>
				</Stack>
			</Box>
		</React.Fragment>
	);
}

export default Join;
