import React from 'react';
import { useSelector } from '../../../store/useSelector';
import { currentQuestionSelector } from '../PollReducer';
import ChartistGraph from 'react-chartist';
import Card from '../../../layout/components/Card/Card';
import CardHeader from '../../../layout/components/Card/CardHeader';
import CardBody from '../../../layout/components/Card/CardBody';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3),
        width: '80%',
        height: '80%',
    },
    card: {
        height: '100%',
    },
    cardHeader: {
        height: '100%',
    },
    chart: {
        height: '100%',
        '& .ct-label': {
            fontSize: '20px',
        },
    },
    question: {
        margin: 0,
    },
}));

export default () => {
    const classes = useStyles();
    const {
        question
    } = useSelector(currentQuestionSelector)

    const answers = question ? question.answers.map(a => {
        const answer = a.text;
        const responses = (question ? question.responses : []).filter(r => r.answerId === a.id).length;
        return {
            answer,
            responses,
        }
    }) : [];

    const data = {
        labels: answers.map(a => a.answer),
        series: answers.map(a => a.responses),
      };
   
      var options = {
        high: Math.max(...answers.map(a => a.responses)) + 1,
        low: 0,
      };
   
      var type = 'Bar'
      var delays = 80,
        durations = 500;
        var delays2 = 80,
        durations2 = 500;
      const animation = {
        draw: function(data: any): any {
          if (data.type === "bar") {
            data.element.animate({
              opacity: {
                begin: (data.index + 1) * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: "ease"
              }
            });
          }
        }
      }

    return (
        <>
            {question && (    
                <div className={classes.container}>
                
                    <Card className={classes.card} chart>
                        <CardHeader className={classes.cardHeader} color="success">
                            <ChartistGraph
                                className={classNames("ct-chart", classes.chart)}
                                data={data}
                                type="Bar"
                                options={options}
                                
                                listener={animation}
                            />
                        </CardHeader>
                        <CardBody>
                            <h2 className={classes.question}>{question.text}</h2>
                        </CardBody>
                    </Card>
                    </div>
                
            )}
        </>
    )
}