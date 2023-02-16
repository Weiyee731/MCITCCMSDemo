import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import DoneIcon from '@mui/icons-material/Done';
import { isArrayNotEmpty } from '../../tools/Helpers';

const steps = ['Seller Information', 'Shop Information', 'Submit'];

export default function HorizontalLinearStepper(props) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());



    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        //page 1
        if (activeStep === 0) {
            if (props.Data.firstname !== "" && props.Data.lastname !== "" && props.Data.icnumber !== "" && props.Data.contactno !== "" &&
                props.Data.email !== "" && props.Data.DOB !== "" && props.Data.userName !== "" && props.Data.accNo !== "" && props.Data.bankName !== "" && props.Data.file1Added == true) {
                let newSkipped = skipped;
                if (isStepSkipped(activeStep)) {
                    newSkipped = new Set(newSkipped.values());
                    newSkipped.delete(activeStep);
                }
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setSkipped(newSkipped);
                props.propsData(parseInt(activeStep + 1), false)
            } else {
                props.propsData(parseInt(activeStep), true)
            }
        }
        if (activeStep === 1) {
            if (props.Data.ShopName !== "" &&
                props.Data.postcode !== "" && props.Data.city !== "" && props.Data.country !== "") {
                let newSkipped = skipped;
                if (isStepSkipped(activeStep)) {
                    newSkipped = new Set(newSkipped.values());
                    newSkipped.delete(activeStep);
                }
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setSkipped(newSkipped);
                props.propsData(parseInt(activeStep + 1), false)
            } else {
                props.propsData(parseInt(activeStep), true)
            }

            if (props.Data.ShopName === "" || props.Data.address1 === "" ||
                props.Data.postcode === "" || props.Data.city === "" || props.Data.country === "") {
                props.propsData(parseInt(activeStep), true)
            }
        }
        if (activeStep === 2) {
            props.propsData(parseInt(activeStep+1), false)
        }


    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        props.propsData(parseInt(activeStep - 1), false)
    };

    // const handleSkip = () => {
    //     if (!isStepOptional(activeStep)) {
    //       You probably want to guard against something like this,
    //       it should never occur unless someone's actively trying to break something.
    //     throw new Error("You can't skip a step that isn't optional.");
    //     }

    //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //     setSkipped((prevSkipped) => {
    //     const newSkipped = new Set(prevSkipped.values());
    //     newSkipped.add(activeStep);
    //     return newSkipped;
    //     });
    // };

    const handleReset = () => {
        setActiveStep(0);
        props.propsData(0, false)
    };

    const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor:
                theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
            borderRadius: 1,
        },
    }));

    const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        ...(ownerState.active && {
            backgroundImage:
                'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        }),
        ...(ownerState.completed && {
            backgroundImage:
                'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        }),
    }));

    function ColorlibStepIcon(props) {
        const { active, completed, className } = props;

        const icons = {
            1: <InfoIcon />,
            2: <StoreIcon />,
            3: <DoneIcon />,
        };

        return (
            <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel connector={<ColorlibConnector />}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    // if (isStepOptional(index)) {
                    //     labelProps.optional = (
                    //     <Typography variant="caption">Optional</Typography>
                    //     );
                    // }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}><h6 variant='subtitile1'>{label}</h6></StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {/* {props.propsData(handleBack,handleNext,handleReset,steps,activeStep)} */}
            {/* {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment> */}
            {/* ) :  */}
            {/* ( */}
            <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>{props.data}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0 || activeStep === 2}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {
                        activeStep === (steps.length - 1) &&
                        <Button color="inherit"
                            sx={{ mr: 1 }}
                            onClick={handleReset}>Retry</Button>
                    }

                    <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Login Now' : 'Next'}
                    </Button>
                </Box>
            </React.Fragment>
            {/* ) */}
            {/* } */}
        </Box>
    );
}
