function Box1 () {
    Robot_Start()
    TracJC()
    Turn_Right()
    TracJC()
    Turn_Right()
    TracJC()
    Turn_Right()
    TracJC()
    Turn_Left()
    TracJC()
    Kick()
}
function Turn_Right () {
    MotorStop()
    iBIT.Spin(ibitSpin.Right, Turn_Speed)
    basic.pause(220)
    MotorStop()
}
function MotorStop () {
    iBIT.MotorStop()
    basic.pause(100)
}
function Forward () {
    iBIT.Motor2(ibitMotor.Forward, Base_Left_Speed, Base_Right_Speed)
}
function Trac_ms () {
    Start = input.runningTime()
    Timer = 0
    while (Timer < Trac_Time) {
        Trac_PID()
        basic.pause(Kt)
        Timer = input.runningTime() - Start
        Cal_Error()
    }
}
function Trac_ms_Speed () {
    Base_Speed = ACC_Speed
    Trac_ms()
    Base_Speed = Speed
}
input.onButtonPressed(Button.A, function () {
    Box1()
    Box2()
    Box3()
    Box4()
    GoStart()
    Finish()
})
function UTurn () {
    MotorStop()
    iBIT.Spin(ibitSpin.Right, Turn_Speed)
    basic.pause(425)
    MotorStop()
}
function TracJC_Slow_Stop () {
    Base_Speed = Slow_Speed
    TracJC()
    Base_Speed = Speed
}
function Turn_Left () {
    MotorStop()
    iBIT.Spin(ibitSpin.Left, Turn_Speed)
    basic.pause(250)
    MotorStop()
}
function Finish () {
    iBIT.MotorStop()
    basic.showString("Finish")
    while (true) {
    	
    }
}
function Box4 () {
    Backward()
    basic.pause(200)
    UTurn()
    TracJC()
    Kick()
}
function GoStart () {
    Backward()
    basic.pause(400)
    Turn_Left()
    TracJC()
    Turn_Right()
    TracJC()
    Turn_Left()
    TracJC()
    Turn_Left()
    Trac_Time = 1000
    Trac_ms()
    Turn_Right()
    TracJC()
    Turn_Right()
    TracJC()
    Turn_Right()
    TracJC()
    Turn_Left()
    TracJC()
    Turn_Left()
    TracJC()
    Turn_Left()
    Trac_Time = 1600
    Trac_ms()
}
function TracJC () {
    Cal_Error()
    while (error < 100) {
        Trac_PID()
        Start = input.runningTime()
        Timer = 0
        while (Timer < Kt && error != 100) {
            Timer = input.runningTime() - Start
            Cal_Error()
        }
    }
}
function Read5ADC () {
    L2 = iBIT.ReadADC(ibitReadADC.ADC0)
    L1 = iBIT.ReadADC(ibitReadADC.ADC1)
    C = iBIT.ReadADC(ibitReadADC.ADC2)
    R1 = iBIT.ReadADC(ibitReadADC.ADC3)
    R2 = iBIT.ReadADC(ibitReadADC.ADC4)
}
function Trac_PID () {
    Initial_Speed()
    Output = Kp * error + (Ki * Sum_error + Kd * (error - Pre_error))
    Left_Speed = Base_Left_Speed + Output
    Right_Speed = Base_Right_Speed - Output
    if (Left_Speed > 0) {
        if (Left_Speed > Max_Speed) {
            Left_Speed = Max_Speed
        }
        iBIT.setMotor(ibitMotorCH.M1, ibitMotor.Forward, Left_Speed)
    } else {
        if (Math.abs(Left_Speed) > Max_Speed) {
            Left_Speed = Max_Speed
        }
        iBIT.setMotor(ibitMotorCH.M1, ibitMotor.Backward, Math.abs(Left_Speed))
    }
    if (Right_Speed > 0) {
        if (Right_Speed > Max_Speed) {
            Right_Speed = Max_Speed
        }
        iBIT.setMotor(ibitMotorCH.M2, ibitMotor.Forward, Right_Speed)
    } else {
        if (Math.abs(Right_Speed) > Max_Speed) {
            Right_Speed = Max_Speed
        }
        iBIT.setMotor(ibitMotorCH.M2, ibitMotor.Backward, Math.abs(Right_Speed))
    }
    Pre_error = error
    Sum_error += error
}
input.onButtonPressed(Button.B, function () {
    Show5ADC()
})
function Robot_Start () {
    Forward()
    basic.pause(500)
}
function Box3 () {
    Backward()
    basic.pause(400)
    Turn_Right()
    Trac_Time = 1000
    Trac_ms()
    Turn_Right()
    TracJC()
    Turn_Right()
    TracJC()
    Kick()
}
function Kick () {
    iBIT.MotorStop()
    iBIT.Servo(ibitServo.SV1, 70)
    basic.pause(300)
    iBIT.Servo(ibitServo.SV1, 125)
}
function Cal_Error () {
    Read5ADC()
    if (L2 > Ref_L2 && (L1 < Ref_L1 && (C > Ref_C && (R1 > Ref_R1 && R2 > Ref_R2)))) {
        error = 3
    } else {
        if (L2 < Ref_L2 && (L1 < Ref_L1 && (C > Ref_C && (R1 > Ref_R1 && R2 > Ref_R2)))) {
            error = 2
        } else {
            if (L2 < Ref_L2 && (L1 > Ref_L1 && (C > Ref_C && (R1 > Ref_R1 && R2 > Ref_R2)))) {
                error = 1
            } else {
                if (L2 > Ref_L2 && (L1 > Ref_L1 && (C > Ref_C && (R1 > Ref_R1 && R2 > Ref_R2)))) {
                    error = 0
                } else {
                    if (L2 > Ref_L2 && (L1 > Ref_L1 && (C > Ref_C && (R1 > Ref_R1 && R2 < Ref_R2)))) {
                        error = -1
                    } else {
                        if (L2 > Ref_L2 && (L1 > Ref_L1 && (C > Ref_C && (R1 < Ref_R1 && R2 < Ref_R2)))) {
                            error = -2
                        } else {
                            if (L2 > Ref_L2 && (L1 > Ref_L1 && (C > Ref_C && (R1 < Ref_R1 && R2 > Ref_R2)))) {
                                error = -3
                            } else {
                                if (C < Ref_C) {
                                    error = 100
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
function Box2 () {
    Backward()
    basic.pause(400)
    Turn_Left()
    Trac_Time = 1000
    Trac_ms()
    Turn_Left()
    TracJC()
    Turn_Right()
    TracJC()
    Turn_Right()
    TracJC()
    Turn_Right()
    TracJC()
    Kick()
}
function Initial_Speed () {
    Base_Left_Speed = Base_Speed - 0
    Base_Right_Speed = Base_Speed - 1
    Max_Speed = Base_Speed
}
function Show5ADC () {
    Read5ADC()
    basic.showNumber(L2)
    basic.pause(1000)
    basic.showNumber(L1)
    basic.pause(1000)
    basic.showNumber(C)
    basic.pause(1000)
    basic.showNumber(R1)
    basic.pause(1000)
    basic.showNumber(R2)
}
function Backward () {
    iBIT.Motor2(ibitMotor.Backward, Base_Left_Speed, Base_Right_Speed)
}
let Max_Speed = 0
let Right_Speed = 0
let Left_Speed = 0
let Pre_error = 0
let Sum_error = 0
let Output = 0
let R2 = 0
let R1 = 0
let C = 0
let L1 = 0
let L2 = 0
let error = 0
let Trac_Time = 0
let Timer = 0
let Start = 0
let Base_Right_Speed = 0
let Base_Left_Speed = 0
let Ref_R2 = 0
let Ref_R1 = 0
let Ref_C = 0
let Ref_L1 = 0
let Ref_L2 = 0
let Kt = 0
let Ki = 0
let Kd = 0
let Kp = 0
let Turn_Speed = 0
let Base_Speed = 0
let Slow_Speed = 0
let ACC_Speed = 0
let Speed = 0
Speed = 60
ACC_Speed = 80
Slow_Speed = 50
Base_Speed = Speed
Turn_Speed = 60
Initial_Speed()
Kp = 50
Kd = 100
Ki = 0
Kt = 10
Ref_L2 = 2500
Ref_L1 = 2500
Ref_C = 2500
Ref_R1 = 2500
Ref_R2 = 2500
Kick()
basic.showIcon(IconNames.No)
