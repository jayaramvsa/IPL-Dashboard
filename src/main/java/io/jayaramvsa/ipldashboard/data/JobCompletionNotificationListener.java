package io.jayaramvsa.ipldashboard.data;

import io.jayaramvsa.ipldashboard.model.Team;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.HashMap;
import java.util.Map;

@Component
public class JobCompletionNotificationListener extends JobExecutionListenerSupport {

    private static final Logger log = LoggerFactory.getLogger(JobCompletionNotificationListener.class);

    private final EntityManager entityManager;

    @Autowired
    public JobCompletionNotificationListener(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public void afterJob(JobExecution jobExecution) {
        if (jobExecution.getStatus() == BatchStatus.COMPLETED) {
            log.info("!!! JOB FINISHED! Time to verify the results");

            Map<String, Team> teamMap = new HashMap<>();

            entityManager.createQuery("select distinct m.team1, count(*) from Match m group by m.team1", Object[].class)
                    .getResultList()
                    .stream()
                    .map(element -> new Team((String) element[0], (long) element[1]))
                    .forEach(team -> teamMap.put(((Team) team).getTeamName(), team));

            entityManager.createQuery("select distinct m.team2 , count(*) from Match m group by m.team2", Object[].class)
                    .getResultList()
                    .stream()
                    .forEach(element -> {
                        Team team = teamMap.get((String) element[0]);
                        team.setTotalMatches(team.getTotalMatches() + (long) element[1]);
                    });
            entityManager.createQuery("select m.matchWinner , count(*) from Match m group by m.matchWinner",Object[].class)
                    .getResultList()
                    .stream()
                    .forEach(element -> {
                        Team team = teamMap.get((String) element[0]);
                       if(team !=null) team.setTotalWins((long) element[1]);
                    });

            teamMap.values().forEach(team -> entityManager.persist(team));
            teamMap.values().forEach(team -> System.out.println(team));

        }
    }
}
