import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

function Join(props) {
	const [redirect, setRedirect] = useState(null);

	const { secret } = useParams();

	useEffect(() => {
		fetch(`/api/events/${secret}/edit`, {
			method: "POST",
		})
			.then((res) => res.json())
			.then((data) => {
				setRedirect(`/o/event/${data.code}`);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [secret]);

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
