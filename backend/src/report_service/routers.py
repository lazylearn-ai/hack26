from fastapi import APIRouter
from report_service.models import AimFormInfo, TaskFormInfo, PlanFormInfo, SourceFormInfo, ReportFormInfo
from report_service.nn import get_aims, get_tasks, get_plan, get_sources, get_report

report_router = APIRouter()

@report_router.post('/aims')
def generate_aims(aimFormInfo: AimFormInfo):
    aims = get_aims(sphere=aimFormInfo.sphere,
                    theme=aimFormInfo.theme)
    return {
        "aims": aims,
    }

@report_router.post('/tasks')
def generate_tasks(taskFormInfo: TaskFormInfo):
    tasks = get_tasks(sphere=taskFormInfo.sphere,
                theme=taskFormInfo.theme,
                aims=taskFormInfo.aims)
    
    return {
        "tasks": tasks
    }


@report_router.post('/plan')
def generate_plan(planFormInfo: PlanFormInfo):
    plan = get_plan(tasks=planFormInfo.tasks)
    return {
        "plan": plan
    }


@report_router.post('/sources')
def generate_sources(sourceFormInfo: SourceFormInfo):
    try:
        print("start collecting cources..")
        sources = get_sources(theme=sourceFormInfo.theme)
        return {
            "sources": sources
        }
    except Exception as e:
        print(str(e))

@report_router.post('/generate')
def generate_report(reportFormInfo: ReportFormInfo):
    report = get_report(
        aims=reportFormInfo.aims,
        tasks=reportFormInfo.tasks,
        sphere=reportFormInfo.sphere,
        theme=reportFormInfo.theme,
        sources=reportFormInfo.sources,
        plan=reportFormInfo.plan
    )
    return {
        "report": report 
    }